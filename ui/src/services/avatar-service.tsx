import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';

const textToAvatarDataUrl = (str: string) => {
    const dataUrl = createAvatar(bottts, {
        seed: str,
        rotate: 350,
        backgroundColor: ["b6e3f4"],
        scale: 95
    }).toDataUriSync();

    return dataUrl;
}

export { textToAvatarDataUrl };