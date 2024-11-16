import { FormEvent, PropsWithChildren, useState } from "react"
import { useParams } from "react-router-dom"

function P({ children, className }: PropsWithChildren<{ className?: string }>) {
    return <p className={"text-sm  dark:text-gray-400 " + (className || '')}>{children}</p>
}

export default function Login() {
    const [showDetail, setShowDetail] = useState(false)
    const [studentID, setStudentID] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const arg = useParams()

    async function submit(e: FormEvent) {
        e.preventDefault()
        const res = await fetch("/api/auth/bupt_login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: studentID, password, uuid: arg.uuid })
        })
        const data = await res.json()
        if (!data.success) {
            setErrorMsg(data.error || "登录失败")
            return
        }
        console.log(data)
    }

    return (
        <>
            <div className="min-h-[100vh] flex flex-col dark:bg-black">
                {!showDetail ?
                    <div className={"md:rounded-lg border bg-card text-card-foreground shadow-sm w-full md:w-[500px] m-auto p-4 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 "}>
                        <div className="flex flex-col p-6 pb-2 space-y-1">
                            <h3 className="whitespace-nowrap font-semibold tracking-tight text-2xl dark:text-white">登录 BYR Docs</h3>
                            <P className='pt-2'>
                                使用
                                <a target="_blank"
                                    href="https://auth.bupt.edu.cn/authserver/login"
                                    className={"text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300 login"}>
                                    北邮统一认证
                                </a>
                                账号登录以上传文件。
                            </P>
                            {errorMsg && <p className="text-sm text-red-500 dark:text-red-400">{errorMsg}</p>}
                        </div>
                        <form onSubmit={submit}>
                            <div className="p-6 pt-2 space-y-4">
                                <div className="space-y-2">
                                    <label
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        htmlFor="student-id">
                                        学号
                                    </label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:placeholder:text-gray-500"
                                        id="studentId" type="text" name="studentId" minLength={10} maxLength={10} required pattern="20\d{8}"
                                        onChange={(e) => setStudentID(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        htmlFor="password">
                                        密码
                                    </label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:placeholder:text-gray-500"
                                        id="password" type="password" name="password" required
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
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
                        <div className="flex flex-col px-6 pt-4 space-y-1">
                            <P className='space-x-2 text-xs'>
                                <button id="loginExplaination"
                                    className={"text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300 "}
                                    onClick={() => setShowDetail(true)}
                                >
                                    此登录是如何工作的?
                                </button>
                            </P>
                        </div>
                    </div> :
                    <div className="md:rounded-lg border bg-card text-card-foreground shadow-sm w-full md:w-[500px] m-auto p-4 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 my-12">
                        <div className="flex flex-col p-6 pb-0 space-y-1">
                            <h3 className="whitespace-nowrap font-semibold tracking-tight text-2xl dark:text-white mb-4">
                                此登录是如何工作的？
                            </h3>
                            <P>
                                本站使用
                                <a href="https://auth.bupt.edu.cn/authserver/login" className={"text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300 login"} target="_blank">北京邮电大学统一认证系统</a>
                                来验证用户身份。以下是我们的登录流程和隐私保护措施的详细说明：
                            </P>
                            <P><b>1. 用户认证过程</b></P>
                            <P>当您在我们的网站上发起登录请求时，我们的系统会模拟一个登录过程，与北京邮电大学的统一认证系统进行通信。</P>
                            <P>您需要输入您的北京邮电大学统一认证的用户名和密码。这些信息将会在登录过程中被传递给北京邮电大学统一认证系统，用于验证您的身份。</P>
                            <P>我们的系统<b>不会存储</b>您的用户名和密码。</P>
                            <P><b>2. 数据处理与安全</b></P>
                            <P>您成功登录后，我们会在您的设备上存储 JSON Web Token（JWT）以维持登录状态。</P>
                            <P>JWT 中会存储您的学号，以达到限制单一用户上传额度的目的。</P>
                            <P><b>3. 保护与隐私</b></P>
                            <P>我们采取了适当的技术和组织安全措施来保护您的数据安全和隐私。</P>
                            <P>我们承诺遵守所有相关的隐私法规保护用户信息不被未授权访问或泄露。</P>
                            <P><b>4. 开放源代码</b></P>
                            <P>
                                为增加透明度，我们提供了登录过程的源代码。您可以通过访问我们的
                                <a className={"mx-1 text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300 login"} href="https://github.com/byrdocs/byrdocs-edge/blob/main/src/login.ts" target="_blank">
                                    GitHub
                                </a>
                                查看详细的实现方法。
                            </P>
                        </div>
                        <div className="flex items-center p-6">
                            <button
                                className="return inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/80 h-10 px-4 py-2 w-full dark:bg-gray-900 dark:hover:bg-gray-700"
                                onClick={() => setShowDetail(false)}
                            >
                                返回
                            </button>
                        </div>
                    </div>}
            </div>
        </>)
}