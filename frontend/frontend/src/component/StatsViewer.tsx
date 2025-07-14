import { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import api from '../api';

export default function StatsViewer() {
  const [code, setCode] = useState('');
  const [data, setData] = useState<any>(null);

  const fetchStats = async () => {
    try {
      const res = await api.get(`/shorturls/${code}`);
      setData(res.data);
    } catch (err: any) {
      setData({ error: err.response?.data?.error || 'Error fetching stats' });
    }
  };

  return (
    <>
      <Typography variant="h4">Short URL Stats</Typography>
      <TextField label="Shortcode" onChange={(e) => setCode(e.target.value)} />
      <Button onClick={fetchStats}>Fetch</Button>

      {data && (
        <div>
          {data.error ? <Typography color="error">{data.error}</Typography> : (
            <>
              <Typography>Original URL: {data.originalUrl}</Typography>
              <Typography>Created At: {data.createdAt}</Typography>
              <Typography>Expires: {data.expiry}</Typography>
              <Typography>Clicks: {data.clicks}</Typography>
              <ul>
                {data.clickDetails.map((c: any, i: number) => (
                  <li key={i}>{c.timestamp} from {c.referrer} ({c.location})</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </>
  );
}
