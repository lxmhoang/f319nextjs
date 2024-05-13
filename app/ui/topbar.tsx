import { UserGroupIcon, Bars4Icon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { DarkThemeToggle } from "flowbite-react";

export default function TopBar({hamClick} : {hamClick: () => void}) {

    return (
        <div className="flex">

{/* <UserGroupIcon /> */}

<Button onClick={hamClick} variant="light"><Bars4Icon /></Button>
        <>Top Bar</>

        </div>
    )

}