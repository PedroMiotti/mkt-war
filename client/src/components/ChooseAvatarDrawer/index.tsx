import React from 'react';
import './style.css';

import { Drawer } from 'antd';

// Assets
import avatars from 'assets/avatar.json';

// Hooks
import useWindowDimensions from "../../hooks/useWindowDimension";

interface IChooseAvatarDrawer {
    openDrawer: boolean;
    closeDrawer: () => void;
}
  

const ChooseAvatarDrawer: React.FC<IChooseAvatarDrawer> = ({openDrawer, closeDrawer}) => {

    const [visible, setVisible] = React.useState(openDrawer);

    React.useEffect(() => {
        if(openDrawer)
            setVisible(!visible)

    }, [openDrawer])


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
                    <img src={avatar.src} alt="avatar icons" />
                ))}
            </div>

        </Drawer>
    )
}


export default ChooseAvatarDrawer;