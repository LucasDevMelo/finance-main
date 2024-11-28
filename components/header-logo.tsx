import Link from "next/link";
import Image from "next/image";

const HeaderLogo = () => {
  return (
    <Link href="/">
            <div className="items-center hidden lg:flex">
                <Image src="/1.png" alt="Logo" height={70} width={70} />
            </div>
        </Link>
  );
};

export default HeaderLogo;
