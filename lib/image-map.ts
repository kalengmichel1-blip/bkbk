// This file provides a manual override for article images
// It serves as a fallback or direct assignment when DB fields are missing

export const ARTICLE_IMAGE_MAP: Record<number, string> = {
    // Trump / USA / Washington
    25: '/assets/trump.jpg',
    496: '/assets/trump.jpg',
    657: '/assets/trump.jpg',

    // Tshisekedi
    242: '/assets/tshisekedi.jpg',
    122: '/assets/tshisekedi.jpg',
    268: '/assets/tshisekedi.jpg',
    283: '/assets/tshisekedi.jpg',
    359: '/assets/tshisekedi.jpg',

    // Kabila
    652: '/assets/kabila.jpg',
    11: '/assets/kabila.jpg', // Assuming ID 11 based on context if exists, relying on script logic mostly

    // Kagame (Rwanda)
    247: '/assets/kagame.jpg',
    280: '/assets/kagame.jpg',

    // Flags (DRC, SADC, etc) - The catch-all for others from the list
    315: '/assets/drc-flag.svg',
    329: '/assets/drc-flag.svg',
    338: '/assets/drc-flag.svg',
    627: '/assets/drc-flag.svg',
    364: '/assets/drc-flag.svg',
    365: '/assets/drc-flag.svg',
    583: '/assets/drc-flag.svg',
    605: '/assets/drc-flag.svg',
    608: '/assets/drc-flag.svg',
    37: '/assets/drc-flag.svg',
    84: '/assets/drc-flag.svg',
    609: '/assets/drc-flag.svg',
    610: '/assets/drc-flag.svg',
    220: '/assets/drc-flag.svg',
    221: '/assets/drc-flag.svg',
    222: '/assets/drc-flag.svg',
    259: '/assets/drc-flag.svg',
    278: '/assets/drc-flag.svg',
    284: '/assets/drc-flag.svg',
    308: '/assets/drc-flag.svg',
    611: '/assets/drc-flag.svg',
    376: '/assets/drc-flag.svg',
    506: '/assets/drc-flag.svg',
    507: '/assets/drc-flag.svg',
    508: '/assets/drc-flag.svg',
    526: '/assets/drc-flag.svg',
    577: '/assets/drc-flag.svg',
    531: '/assets/drc-flag.svg',
    569: '/assets/drc-flag.svg',
    659: '/assets/drc-flag.svg',
    612: '/assets/drc-flag.svg',
    629: '/assets/drc-flag.svg',
    647: '/assets/drc-flag.svg',
    648: '/assets/drc-flag.svg',
    649: '/assets/drc-flag.svg',
    651: '/assets/drc-flag.svg',
    654: '/assets/drc-flag.svg',
    658: '/assets/drc-flag.svg',
    660: '/assets/drc-flag.svg',
    661: '/assets/drc-flag.svg',
    662: '/assets/drc-flag.svg',
    663: '/assets/drc-flag.svg',
};

export function getBackfillImage(id: number): string | null {
    if (ARTICLE_IMAGE_MAP[id]) {
        return ARTICLE_IMAGE_MAP[id];
    }
    return null;
}
