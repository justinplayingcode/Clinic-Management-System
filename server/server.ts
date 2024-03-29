import dotenvConfig from './src/helper/dotenv.config';
import app from './src';
dotenvConfig();

const port = process.env.APP_PORT || 3030;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})