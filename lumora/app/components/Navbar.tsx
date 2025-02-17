import Image from "next/image";

const Navbar = () => {
  return (
    <div className="flex p-4 m-3">
        <div>
            <Image
              className=""
              src="/lumora.svg"
            alt="logo"
            width={100}
            height={100}
            />
        </div>
    </div>
  )
}

export default Navbar