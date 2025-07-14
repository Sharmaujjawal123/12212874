import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import api from '../api'; // Make sure this file correctly configures Axios

interface InputItem {
  url: string;
  shortcode: string;
  validity: string;
}

export default function ShortenerForm() {
  const [inputs, setInputs] = useState<InputItem[]>([
    { url: '', shortcode: '', validity: '' },
  ]);
  const [results, setResults] = useState<any[]>([]);

  const handleChange = (
    index: number,
    field: keyof InputItem,
    value: string
  ) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const addField = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: '', shortcode: '', validity: '' }]);
    }
  };

  const submit = async () => {
    const data = await Promise.all(
      inputs.map(async (input) => {
        try {
          const res = await api.post('/shorturls', {
            url: input.url,
            shortcode: input.shortcode || undefined,
            validity: input.validity ? parseInt(input.validity) : undefined,
          });
          return res.data;
        } catch (err: any) {
          return { error: err.response?.data?.error || 'Unknown error' };
        }
      })
    );
    setResults(data);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #f3f4f6, #e0f7fa)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6,
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          width: '100%',
          maxWidth: 700,
          bgcolor: 'white',
        }}
      >
        <Typography variant="h4" textAlign="center" mb={3}>
          🌐 URL Shortener
        </Typography>

        <Stack spacing={3}>
          {inputs.map((input, i) => (
            <Box
              key={i}
              sx={{
                border: '1px solid #ccc',
                borderRadius: 2,
                p: 2,
                backgroundColor: '#f9f9f9',
              }}
            >
              <Stack spacing={2}>
                <TextField
                  label="Long URL"
                  fullWidth
                  value={input.url}
                  onChange={(e) => handleChange(i, 'url', e.target.value)}
                />
                <TextField
                  label="Custom Shortcode (optional)"
                  fullWidth
                  value={input.shortcode}
                  onChange={(e) =>
                    handleChange(i, 'shortcode', e.target.value)
                  }
                />
                <TextField
                  label="Validity (minutes, optional)"
                  type="number"
                  fullWidth
                  value={input.validity}
                  onChange={(e) =>
                    handleChange(i, 'validity', e.target.value)
                  }
                />
              </Stack>
            </Box>
          ))}
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          mt={3}
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Button
            variant="outlined"
            onClick={addField}
            disabled={inputs.length >= 5}
          >
            ➕ Add URL
          </Button>
          <Button variant="contained" color="primary" onClick={submit}>
            🚀 Shorten URLs
          </Button>
        </Stack>

        {results.length > 0 && (
          <>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom>
              🔗 Results
            </Typography>
            <Stack spacing={2}>
              {results.map((res, i) => (
                <Paper
                  key={i}
                  sx={{
                    p: 2,
                    bgcolor: res.error ? '#ffebee' : '#e8f5e9',
                    border: res.error ? '1px solid red' : '1px solid green',
                  }}
                >
                  <Typography variant="body1">
                    {res.shortLink
                      ? `✅ ${res.shortLink} (Expires at: ${res.expiry})`
                      : `❌ Error: ${res.error}`}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  );
}
