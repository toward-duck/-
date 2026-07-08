import { Router } from 'express';
import pool, { hashPassword, verifyPassword } from './db-mysql'; 

const router = Router();

// --- 1. 用户认证与注册 ---
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "用户名和密码不能为空" });

  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = (users as any[])[0];

    if (user) {
      if (verifyPassword(password, user.salt, user.passwordHash)) {
        res.json({ id: user.id, username: user.username, avatar: user.avatar, role: user.role });
      } else {
        res.status(401).json({ error: "密码错误" });
      }
    } else {
      const { salt, hash } = hashPassword(password);
      const role = username === 'admin' ? 'admin' : 'user';
      const newId = Date.now().toString();
      
      await pool.execute(
        'INSERT INTO users (id, username, salt, passwordHash, role) VALUES (?, ?, ?, ?, ?)',
        [newId, username, salt, hash, role]
      );
      
      res.json({ id: newId, username, avatar: 'default.png', role, message: "注册成功" });
    }
  } catch (err) {
    console.error("数据库查询失败:", err);
    res.status(500).json({ error: "数据库查询失败" });
  }
});

// --- 2. 体质测试结果存取 ---
router.post('/test-result', async (req, res) => {
  const { username, result } = req.body;
  if (!username || !result) return res.status(400).json({ error: "缺少必要参数" });
  
  const newId = Date.now().toString();
  try {
    await pool.execute(
      'INSERT INTO tests (id, username, result) VALUES (?, ?, ?)',
      [newId, username, result]
    );
    res.json({ success: true, data: { id: newId, username, result } });
  } catch (err) {
    console.error("保存测试结果失败:", err);
    res.status(500).json({ error: "保存测试结果失败" });
  }
});

router.get('/test-result', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "缺少 username 参数" });
  
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM tests WHERE username = ? ORDER BY created_at DESC LIMIT 1',
      [username]
    );
    const lastTest = (rows as any[])[0];
    res.json(lastTest || { result: null });
  } catch (err) {
    console.error("读取测试结果失败:", err);
    res.status(500).json({ error: "读取测试结果失败" });
  }
});

// --- 3. 后台用户管理 (Admin) ---
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id, username, avatar, role, created_at FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "读取用户列表失败" });
  }
});

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    if ((result as any).affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "用户不存在" });
    }
  } catch (err) {
    res.status(500).json({ error: "删除用户失败" });
  }
});

// --- 4. 真实的药草数据库接口 (对接 MySQL) ---
router.get('/herbs/daily', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM herbs');
    const herbs = rows as any[];
    
    if (herbs.length === 0) {
      return res.json(null);
    }

    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const dailyHerbRow = herbs[dateSeed % herbs.length];

    res.json({
      ...dailyHerbRow,
      channels: dailyHerbRow.channels ? dailyHerbRow.channels.split(',') : [],
      usage: dailyHerbRow.usage || dailyHerbRow.usage_method 
    });
  } catch (err) {
    console.error("获取每日一草失败:", err);
    res.status(500).json({ error: "获取每日一草失败" });
  }
});

router.get('/herbs', async (req, res) => {
  const query = req.query.q as string;
  try {
    let sql = 'SELECT * FROM herbs';
    let params: any[] = [];
    
    if (query) {
      sql += ' WHERE `name` LIKE ? OR `pinyin` LIKE ? OR `efficacy` LIKE ? OR `category` LIKE ?';
      const likeQuery = `%${query}%`;
      params = [likeQuery, likeQuery, likeQuery, likeQuery];
    }
    
    const [rows] = await pool.execute(sql, params);
    
    const herbs = (rows as any[]).map(row => ({
      ...row,
      channels: row.channels ? row.channels.split(',') : [],
      usage: row.usage || row.usage_method
    }));
    res.json(herbs);
  } catch (err) {
    console.error("检索药草失败:", err);
    res.status(500).json({ error: "检索药草失败" });
  }
});

router.post('/herbs', async (req, res) => {
  const { name, pinyin, category, nature, channels, description, efficacy, usage, contraindications, imageUrl } = req.body;
  try {
    const channelsStr = Array.isArray(channels) ? channels.join(',') : channels;
    const [result] = await pool.execute(
      `INSERT INTO herbs (\`name\`, \`pinyin\`, \`category\`, \`nature\`, \`channels\`, \`description\`, \`efficacy\`, \`usage\`, \`contraindications\`, \`imageUrl\`) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, pinyin, category, nature, channelsStr, description, efficacy, usage, contraindications, imageUrl || '']
    );
    res.json({ success: true, id: (result as any).insertId });
  } catch (err) {
    console.error("添加药草失败:", err);
    res.status(500).json({ error: "添加药草失败" });
  }
});

// --- 5. AI 智能问诊大模型接口 ---
router.post('/chat', async (req, res) => {
  const { messages } = req.body;
  // 获取 .env 中的配置，并适配 Ollama 的原生 API 路径
  const ollamaUrl = (process.env.LOCAL_AI_URL || 'http://localhost:11434/v1').replace('/v1', '/api');
  const model = process.env.LOCAL_AI_MODEL || 'qwen2';

  try {
    // 1. 向本地的 Ollama 发送请求
    const response = await fetch(`${ollamaUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: true // 开启流式输出
      }),
    });

    if (!response.ok) {
       return res.status(500).json({ error: '无法连接到本地 AI 模型，请检查 Ollama 是否运行' });
    }

    // 2. 设置 SSE (Server-Sent Events) 响应头，与前端 ai.ts 匹配
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body?.getReader();
    if (!reader) throw new Error("无法读取大模型响应流");
    const decoder = new TextDecoder('utf-8');

    // 3. 持续读取大模型生成的数据，并包装成前端需要的格式转发
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        res.write('data: [DONE]\n\n'); // 告诉前端输出结束
        res.end();
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(l => l.trim() !== '');

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          // 提取 Ollama 的回复文本，并包装为 { content: "..." } 给前端解析
          if (parsed.message && parsed.message.content) {
             res.write(`data: ${JSON.stringify({ content: parsed.message.content })}\n\n`);
          }
        } catch (e) {
          console.error("解析数据块失败:", e);
        }
      }
    }
  } catch (err) {
    console.error("AI 接口请求失败:", err);
    res.status(500).json({ error: "大模型请求失败，请确保本地 Ollama 已启动并下载了对应模型。" });
  }
});

export default router;