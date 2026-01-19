// This file provides a manual override for article images
// It serves as a fallback or direct assignment when DB fields are missing

export const ARTICLE_IMAGE_MAP: Record<number, string> = {
    // Trump / USA / Washington
    25: '/images/backfill/trump.jpg',
    496: '/images/backfill/trump.jpg',
    657: '/images/backfill/trump.jpg',

    // Tshisekedi
    242: '/images/backfill/tshisekedi.jpg',
    122: '/images/backfill/tshisekedi.jpg',
    268: '/images/backfill/tshisekedi.jpg',
    283: '/images/backfill/tshisekedi.jpg',
    359: '/images/backfill/tshisekedi.jpg',

    // Kabila
    652: '/images/backfill/kabila.jpg',
    11: '/images/backfill/kabila.jpg', // Assuming ID 11 based on context if exists, relying on script logic mostly

    // Kagame (Rwanda)
    247: '/images/backfill/kagame.jpg',
    280: '/images/backfill/kagame.jpg',

    // Flags (DRC, SADC, etc) - The catch-all for others from the list
    315: '/images/backfill/drc-flag.svg',
    329: '/images/backfill/drc-flag.svg',
    338: '/images/backfill/drc-flag.svg',
    627: '/images/backfill/drc-flag.svg',
    364: '/images/backfill/drc-flag.svg',
    365: '/images/backfill/drc-flag.svg',
    583: '/images/backfill/drc-flag.svg',
    605: '/images/backfill/drc-flag.svg',
    608: '/images/backfill/drc-flag.svg',
    37: '/images/backfill/drc-flag.svg',
    84: '/images/backfill/drc-flag.svg',
    609: '/images/backfill/drc-flag.svg',
    610: '/images/backfill/drc-flag.svg',
    220: '/images/backfill/drc-flag.svg',
    221: '/images/backfill/drc-flag.svg',
    222: '/images/backfill/drc-flag.svg',
    259: '/images/backfill/drc-flag.svg',
    278: '/images/backfill/drc-flag.svg',
    284: '/images/backfill/drc-flag.svg',
    308: '/images/backfill/drc-flag.svg',
    611: '/images/backfill/drc-flag.svg',
    376: '/images/backfill/drc-flag.svg',
    506: '/images/backfill/drc-flag.svg',
    507: '/images/backfill/drc-flag.svg',
    508: '/images/backfill/drc-flag.svg',
    526: '/images/backfill/drc-flag.svg',
    577: '/images/backfill/drc-flag.svg',
    531: '/images/backfill/drc-flag.svg',
    569: '/images/backfill/drc-flag.svg',
    659: '/images/backfill/drc-flag.svg',
    612: '/images/backfill/drc-flag.svg',
    629: '/images/backfill/drc-flag.svg',
    647: '/images/backfill/drc-flag.svg',
    648: '/images/backfill/drc-flag.svg',
    649: '/images/backfill/drc-flag.svg',
    651: '/images/backfill/drc-flag.svg',
    654: '/images/backfill/drc-flag.svg',
    658: '/images/backfill/drc-flag.svg',
    660: '/images/backfill/drc-flag.svg',
    661: '/images/backfill/drc-flag.svg',
    662: '/images/backfill/drc-flag.svg',
    663: '/images/backfill/drc-flag.svg',
};

export function getBackfillImage(id: number): string | null {
    if (ARTICLE_IMAGE_MAP[id]) {
        return ARTICLE_IMAGE_MAP[id];
    }
    return null;
}
