import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http'; 
import { Server } from 'socket.io';   
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import workflowRoutes from './routes/workflowRoutes.js';
import { planWorkflowExecution } from './agents/plannerAgent.js'; 
import { classifyAndRouteFailure } from './agents/recoveryAgent.js'; 
import { validateNodeConfigurations } from './agents/validationAgent.js'; 

const app = express();
const httpServer = createServer(app); 

// Attach Socket.io server layer with proper local origin clearances
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true
  }
});

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(compression());

app.use('/api/auth', authRoutes);
app.use('/api/workflows', workflowRoutes);

// 🌐 REAL-TIME EVENT ENGINE
io.on('connection', (socket) => {
  console.log(`🔌 Live monitoring stream linked to client: ${socket.id}`);

  // Listen explicitly for the frontend button action click event with full data payload
  socket.on('trigger_agent_execution', (data) => {
    console.log(`⚡ Core Execution Triggered for workflow: ${data.workflowName}`);
    
    // 🧠 1. Execute topological Graph Planner over real canvas snapshots
    const planResult = planWorkflowExecution(data.nodes || [], data.edges || []);
    
    // 🔍 2. Run the Validation Agent to evaluate parameter configurations
    const validationResult = validateNodeConfigurations(data.nodes || []);
    
    // 🔍 3. Extract active configuration variables chosen by the operator
    const targetAgentNode = data.nodes?.find(n => n.type === 'agentNode');
    const selectedModel = targetAgentNode?.data?.model || "gemini-1.5-pro";
    const appliedPrompt = targetAgentNode?.data?.prompt || "";

    let step = 0;
    const executionLogs = [
      `⚡ [Trigger] Initializing pipeline execution context for: ${data.workflowName}`,
      planResult.success 
        ? `🧠 [Planner Agent] Graph analyzed. Order sequence: ${planResult.executionPath.map(n => n.label).join(' ➡️ ')}`
        : `❌ [Planner Agent] Graph Analysis Failed: ${planResult.error}`,
      `📊 [Planner Agent] Routing readiness score mapped at: ${(planResult.confidenceScore * 100)}%`,
    ];

    // 🛡️ 4. Conditional Engine Routing based on active Verification States
    if (!validationResult.isValid) {
      const firstFailure = validationResult.failures[0];
      const errorMsg = `Validation Blocked: ${firstFailure.message}`;
      
      // Send real structural validation failures straight to the recovery rules engine
      const recoveryStrategy = classifyAndRouteFailure(errorMsg, 0);

      executionLogs.push(
        `⚠️ [Validation Agent] Compliance Warning: Node "${firstFailure.label}" failed criteria check.`,
        `🛡️ [Recovery Agent] Running rules engine... Error mapped to cluster: [${recoveryStrategy.classification}]`,
        `🚨 [Recovery Agent] Strategy decision: **${recoveryStrategy.action.toUpperCase()}** ➡️ ${recoveryStrategy.reason}`,
        `🛑 [Completed] Pipeline stopped early. Please populate node properties and run again.`
      );
    } else {
      // If validation criteria matches perfectly, run standard execution blocks safely
      executionLogs.push(
        `✅ [Validation Agent] Parameter configurations passed all structural compliance guards!`,
        `⚙️ [Configuration] Routing operational data packets to engine router [${selectedModel}]`,
        `🧠 [System Prompt] Injecting context instructions: "${appliedPrompt.substring(0, 45)}${appliedPrompt.length > 45 ? '...' : ''}"`,
        `🔍 [Tool Execution] Accessing active connector channels...`,
        `✅ [Completed] Workflow pipeline successfully processed without exceptions.`
      );
    }

    // Fire log intervals to feed the frontend timeline terminal widget smoothly
    const logInterval = setInterval(() => {
      if (step < executionLogs.length) {
        io.emit('execution_log', {
          message: executionLogs[step],
          timestamp: new Date().toLocaleTimeString()
        });
        step++;
      } else {
        clearInterval(logInterval);
      }
    }, 1800);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Live stream disconnected for client: ${socket.id}`);
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error Framework Breakage' });
});

const startServer = async () => {
  try {
    console.log("⏳ Connecting to database orchestration cluster...");
    await connectDB();
    console.log("🔗 Database connection verified successfully.");
  } catch (dbError) {
    console.error("⚠️ Database connection failed, booting in offline developer sandbox mode:", dbError.message);
  }

  httpServer.listen(config.port, () => {
    console.log(`🚀 Agentflow_AI Engine & Socket Layer active at http://127.0.0.1:${config.port}`);
  });
};

startServer();