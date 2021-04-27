import avatar from 'assets/avatar.json';

const SelectAvatarSrc = (avatarId: string): string => {
    let result: { id: number; src: string; }[];
    let src: string;

    result = avatar.avatars.filter((i) => i.id.toString() == avatarId)

    src = result[0] ? result[0].src : '';

    return src;
}

export default SelectAvatarSrc;