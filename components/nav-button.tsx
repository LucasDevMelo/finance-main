import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  label: string;
  isActive?: boolean;
};

const NavButton = ({ href, label, isActive }: Props) => {
  return (
    <Button
            asChild
            size="sm"
            variant="outline"
            className={cn(
                "w-full lg:w-auto justify-between font-normal border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none transition",
                isActive
                    ? "bg-[#E7D49E] text-[#2E3D3E]" // Cor de fundo e texto no estado ativo
                    : "bg-transparent text-[#E7D49E] hover:bg-[#E7D49E] hover:text-[#2E3D3E]", // Cor no estado hover e normal
            )}
        >
            <Link href={href}>
                {label}
            </Link>
        </Button>
  );
};

export default NavButton;
