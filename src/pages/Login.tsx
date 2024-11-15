import { PropsWithChildren, useState } from "react"

function P({ children, className }: PropsWithChildren<{ className?: string }>) {
    return <p className={"text-sm  dark:text-gray-400 " + (className || '')}>{children}</p>
}

export default function Login() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [errorMsg, setErrormsg] = useState("")

    return (
        <>
            <div className="min-h-[100vh] flex flex-col dark:bg-black">
                <div className={"md:rounded-lg border bg-card text-card-foreground shadow-sm w-full md:w-[500px] m-auto p-4 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 "} id="loginCard">
                    <div className="flex flex-col p-6 pb-2 space-y-1">
                        <h3 className="whitespace-nowrap font-semibold tracking-tight text-2xl dark:text-white">登录 BYR Docs</h3>
                        <P className='pt-2'>
                            使用
                            <a target="_blank"
                                className={"text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300 login"}>
                                北邮统一认证
                            </a>
                            账号登录以上传文件。
                        </P>
                        {errorMsg && <p className="text-sm text-red-500 dark:text-red-400">{errorMsg}</p>}
                    </div>
                    <form method="post" action="/login" id="loginForm">
                        <div className="p-6 pt-2 space-y-4">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="student-id">
                                    学号
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:placeholder:text-gray-500"
                                    id="studentId" type="text" name="studentId" minLength={10} maxLength={10} required pattern="20\d{8}" />
                            </div>
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="password">
                                    密码
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:placeholder:text-gray-500"
                                    id="password" type="password" name="password" required />
                            </div>
                        </div>
                        <div className="flex items-center px-6">
                            <button
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/80 h-10 px-4 py-2 w-full dark:bg-gray-900 dark:hover:bg-gray-700"
                                type="submit" id="login">
                                登录
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>)
}