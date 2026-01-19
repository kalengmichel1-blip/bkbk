import fs from 'fs';
import path from 'path';
import https from 'https';

const IMAGES = [
    { name: 'tshisekedi.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/F%C3%A9lix_Tshisekedi_-_2019_(cropped).jpg' },
    { name: 'kabila.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Joseph_Kabila_April_2016.jpg' },
    { name: 'kagame.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/President_Paul_Kagame_(portrait).jpg' },
    { name: 'trump.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg' },
    { name: 'drc-flag.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_the_Democratic_Republic_of_the_Congo.svg' },
    { name: 'sadc-flag.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_SADC.svg' },
    { name: 'rwanda-flag.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Flag_of_Rwanda.svg' },
    { name: 'usa-flag.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg' },
    { name: 'un-flag.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_the_United_Nations.svg' }
];

const DEST_DIR = path.join(process.cwd(), 'public', 'images', 'backfill');

if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

async function downloadImage(url: string, filename: string) {
    const destPath = path.join(DEST_DIR, filename);
    const file = fs.createWriteStream(destPath);

    return new Promise((resolve, reject) => {
        const request = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://en.wikipedia.org/'
            }
        }, function (response) {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${filename}: Status ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filename}`);
                resolve(true);
            });
        }).on('error', function (err) {
            fs.unlink(destPath, () => { });
            reject(err);
        });
    });
}

async function run() {
    console.log("Starting downloads...");
    for (const img of IMAGES) {
        try {
            await downloadImage(img.url, img.name);
        } catch (e) {
            console.error(e);
        }
    }
    console.log("All finished.");
}

run();
