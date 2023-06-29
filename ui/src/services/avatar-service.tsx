import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';

const textToAvatarDataUrl = (str: string) => {
    const dataUrl = createAvatar(botttsNeutral, {
        seed: `${str}`,
        rotate: 350
    }).toDataUriSync();

    return dataUrl;
}

export { textToAvatarDataUrl };