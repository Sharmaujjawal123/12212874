import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function Log(
  stack: 'backend' | 'frontend',
  level: 'info' | 'warn' | 'error' | 'fatal',
  logPackage: 'auth' | 'config' | 'middleware' | 'utils' | 'component' | 'hook' | 'page' | 'state' | 'style' | 'handler' | 'db',
  message: string
): Promise<void> {
  try {
    const res = await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      {
        stack,
        level,
        package: logPackage,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // optional: log success locally for debug
    // console.log("Log success:", res.data);
  } catch (error: any) {
    console.error('Logging failed:', error.response?.data || error.message);
  }
}
