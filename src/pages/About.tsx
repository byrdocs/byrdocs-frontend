import { Logo } from "@/components/logo";
import { Link } from "react-router-dom";

export default function About() {

    return (
        <div className="md:w-[800px] w-full md:m-auto px-10 flex flex-col h-[100vh]">
            <div className="w-full m-auto h-98">
                <div className="text-center mb-12" style={{lineHeight: 3}}>
                    <span className="text-4xl sm:text-5xl md:text-6xl">关于</span>
                    <Logo className="inline-block" size={2}/>
                </div>
                <div className="space-y-3 text-xl">
                    <li>
                        <p>本站是一个文件分享平台，致力于收集整理北邮人的学习资料，为北邮人提供一个方便的学习资源库。</p>
                    </li>
                    <li>
                        <p>
                            如果您有任何问题或建议、想要贡献资料或者加入我们，请发送邮件至
                            <a href="mailto:contact@byrdocs.org" className="text-blue-500 hover:text-blue-400">contact@byrdocs.org</a>。注意，当前只接受资源贡献，不接受资源请求。
                        </p>
                    </li>
                    <li>
                        <p>GitHub: <a href="https://github.com/byrdocs" className="text-blue-500 hover:text-blue-400" target="_blank" rel="noreferrer">byrdocs</a></p>
                    </li>
                </div>
                <div className="w-full mt-12 text-center text-blue-500 hover:text-blue-400">
                    <Link to="/">返回首页</Link>
                </div>
            </div>
        </div>
    );
}