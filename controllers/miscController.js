const axios = require('axios');

exports.getHealth = (req, res) => {
  res.json({ ok: true, message: 'MediGo API is working' });
};

exports.proxyImage = async (req, res, next) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) {
      return res.status(400).send('URL is required');
    }

    if (imageUrl.startsWith('data:')) {
      const parts = imageUrl.split(',');
      const mime = parts[0].match(/:(.*?);/)[1];
      const data = Buffer.from(parts[1], 'base64');
      res.writeHead(200, {
        'Content-Type': mime,
        'Content-Length': data.length
      });
      return res.end(data);
    }

    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/*'
      },
      timeout: 10000
    });

    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    response.data.pipe(res);
  } catch (error) {
    console.error('Image proxy error:', error.message);
    res.status(500).send('Failed to fetch image');
  }
};

exports.getDrugInfo = async (req, res, next) => {
  try {
    const name = req.query.name || 'aspirin';
    const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(name)}&limit=1`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(404).json({ message: 'External drug info not found' });
    }

    const data = await response.json();

    res.json({
      source: 'openFDA',
      result:
        data.results?.[0]?.purpose?.[0] ||
        data.results?.[0]?.indications_and_usage?.[0] ||
        'No short info available'
    });
  } catch (error) {
    next(error);
  }
};
