import React from 'react';
import './style.css';

import { Drawer } from 'antd';

// Assets
import avatars from 'assets/avatar.json';

// Hooks
import useWindowDimensions from "../../hooks/useWindowDimension";

// Context 
import { useUserContext } from "../../context/user/user.context";

interface IChooseAvatarDrawer {
    openDrawer: boolean;
    closeDrawer: () => void;
}


const ChooseAvatarDrawer: React.FC<IChooseAvatarDrawer> = ({ openDrawer, closeDrawer }) => {
    const { updateUserAvatar } = useUserContext();

    const [visible, setVisible] = React.useState(openDrawer);

    React.useEffect(() => {
        if (openDrawer)
            setVisible(true)
        else
            setVisible(false);

    }, [openDrawer])

    const updateAvatar = (avatarId: string) => {
        updateUserAvatar(avatarId);
        closeDrawer();
    }

    const { width } = useWindowDimensions();

    return (
        <Drawer
            height={width <= 900 ? 500 : 300}
            title="Selecionar Avatar "
            placement={"bottom"}
            closable={false}
            visible={visible}
            onClose={closeDrawer}
        >
            <div className="chooseavatar-container">
                {avatars.avatars.map(avatar => (
                    <img key={avatar.id} src={avatar.src} alt="avatar icons" onClick={() => updateAvatar(avatar.id.toString())} />
                ))}
            </div>

        </Drawer>
    )
}


export default ChooseAvatarDrawer;