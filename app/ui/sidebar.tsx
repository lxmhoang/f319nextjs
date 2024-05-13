
'use client'
import { UserGroupIcon, ServerStackIcon, ChartPieIcon } from "@heroicons/react/24/solid";
import { CustomFlowbiteTheme, DarkThemeToggle, Drawer, Navbar, Sidebar, TextInput } from "flowbite-react";
const customTheme: CustomFlowbiteTheme['sidebar'] = {
    root: {
      base: 'bg-red-500',
      inner: 'bg-blue-500'
    }
  } 

export default function SideBar({isOpen, handleClose} : {handleClose: ()=> void, isOpen: boolean}) {
    return (
      <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header title="MENU" titleIcon={() => <></>} />
        <Drawer.Items>
          <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0"
          >
            <div className="flex h-full flex-col justify-between py-2">
              <div>
                <form className="pb-3 md:hidden">
                  <TextInput icon={ServerStackIcon} type="search" placeholder="Search" required size={32} />
                </form>
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item href="/" icon={ChartPieIcon}>
                      Dashboard
                    </Sidebar.Item>
                    <Sidebar.Item href="/e-commerce/products" icon={ChartPieIcon}>
                      Products
                    </Sidebar.Item>
                    <Sidebar.Item href="/users/list" icon={ChartPieIcon}>
                      Users list
                    </Sidebar.Item>
                    <Sidebar.Item href="/authentication/sign-in" icon={ChartPieIcon}>
                      Sign in
                    </Sidebar.Item>
                    <Sidebar.Item href="/authentication/sign-up" icon={ChartPieIcon}>
                      Sign up
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item href="https://github.com/themesberg/flowbite-react/" icon={ChartPieIcon}>
                      Docs
                    </Sidebar.Item>
                    <Sidebar.Item href="https://flowbite-react.com/" icon={ChartPieIcon}>
                      Components
                    </Sidebar.Item>
                    <Sidebar.Item href="https://github.com/themesberg/flowbite-react/issues" icon={ChartPieIcon}>
                      Help
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </div>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    );
}