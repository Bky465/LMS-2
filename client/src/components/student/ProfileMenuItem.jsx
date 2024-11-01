'us client'

import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserLogoutMutation } from "../../../provider/redux/query/Auth";
export default function ProfileMenuItem() {
    const categories_data = [
        {
            title: "My Account",
            href: "/student/my-account",
        }
    ]

    const router = useRouter()
    const [userLogout]= useUserLogoutMutation()


    const handleLogout= async ()=>{
       try {
        const response=  await userLogout().unwrap()
        console.log(response);
        
        router.push('/auth')
       } catch (error) {
        console.log(error);
        
       }
         
    }
    return (
        <NavigationMenu className='[&_.absolute.top-full.flex.justify-center]:left-[-3rem]'>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger showIcon={false}>
                        <div className="relative rounded-full w-8 h-8 bg-black flex justify-center items-center text-white font-semibold">
                            JP
                        </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="flex flex-col gap-3 p-4 w-max">
                            {categories_data.map((component) => (
                             
                                <li key={component.title} className='hover:text-indigo-500 text-xs font-normal'>
                                    <Link href={component.href}>{component.title}</Link>
                                </li>
                            ))}

                            <button
                             onClick={handleLogout}
                            className="hover:text-indigo-500 text-xs font-normal flex justify-start w-fit">Logout</button>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
       
    );
}
