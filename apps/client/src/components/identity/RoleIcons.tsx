import { TRoles } from "@/data-access-layer/users/viewer";

interface RoleIconsProps {
  role: TRoles;
}

export function RoleIcons({ role }: RoleIconsProps) {
  if (role === "staff") {
    return (
      <svg
        className="size-10  text-success"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            className="stroke-success-content"
            d="M4 21C4 17.4735 6.60771 14.5561 10 14.0709M19.8726 15.2038C19.8044 15.2079 19.7357 15.21 19.6667 15.21C18.6422 15.21 17.7077 14.7524 17 14C16.2923 14.7524 15.3578 15.2099 14.3333 15.2099C14.2643 15.2099 14.1956 15.2078 14.1274 15.2037C14.0442 15.5853 14 15.9855 14 16.3979C14 18.6121 15.2748 20.4725 17 21C18.7252 20.4725 20 18.6121 20 16.3979C20 15.9855 19.9558 15.5853 19.8726 15.2038ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"></path>{" "}
        </g>
      </svg>
    );
  }
  if (role === "tenant") {
    return (
      <svg
        className=" text-success size-10"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M12.25 12.5C12.25 13.6046 11.3546 14.5 10.25 14.5C9.14543 14.5 8.25 13.6046 8.25 12.5C8.25 11.3954 9.14543 10.5 10.25 10.5C11.3546 10.5 12.25 11.3954 12.25 12.5Z"
            fill="#1F2328"></path>{" "}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.25 4.5L20 10.1893V18H16.5V20H4V11.9393L10.25 5.68933L11.625 7.06433L14.25 4.5ZM18.5 10.8107V16.5H16.5V11.9393L12.6857 8.12499L14.25 6.56065L18.5 10.8107ZM5.5 12.5607V18.5H6.78545C7.02806 16.8038 8.48677 15.5 10.25 15.5C12.0132 15.5 13.4719 16.8038 13.7146 18.5H15V12.5607L10.25 7.81065L5.5 12.5607Z"
            fill="#1F2328"></path>{" "}
        </g>
      </svg>
    );
  }
  if (role === "admin") {
    return (
      <svg
        className="size-10 text-error"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM12 11C10.9 11 10 10.1 10 9C10 7.9 10.9 7 12 7C13.1 7 14 7.9 14 9C14 10.1 13.1 11 12 11ZM12 17C9.33 17 7.08 15.34 6 13C6.03 10.97 10 9.9 12 9.9C13.99 9.9 17.97 10.97 18 13C16.92 15.34 14.67 17 12 17Z"
            fill="currentColor"
          />
        </g>
      </svg>
    );
  }
  if (role === "manager") {
    return (
      <svg
        className="size-10 text-warning"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M12 5.5C10.067 5.5 8.5 7.067 8.5 9C8.5 10.933 10.067 12.5 12 12.5C13.933 12.5 15.5 10.933 15.5 9C15.5 7.067 13.933 5.5 12 5.5ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14ZM21 7H19V5H17V7H15V9H17V11H19V9H21V7Z"
            fill="currentColor"
          />
        </g>
      </svg>
    );
  }
  return (
    <svg
      className="size-10 text-success"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
          fill="#000000"></path>{" "}
        <path
          d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"
          fill="#000000"></path>{" "}
      </g>
    </svg>
  );
}
