import { Logo } from "@/components/logo";
import { Link } from "react-router-dom";

function A({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <a href={href} className="mx-1 text-blue-500 hover:text-blue-400" target="_blank">{children}</a>
    )
}
export default function About() {
    const idx = history.state.idx || 0;
    return (
        <div className="md:w-[800px] w-full md:m-auto px-10 flex flex-col h-[100vh]">
            <div className="w-full m-auto h-98">
                <div className="text-center mb-12" style={{lineHeight: 3}}>
                    <span className="text-4xl sm:text-5xl md:text-6xl">关于</span>
                    <Logo className="inline-block" size={2}/>
                </div>
                <div className="space-y-3 text-xl">
                    <li>
                        BYR Docs 是一个资料分享平台，旨在使北邮学生更方便地获取与北邮课程有关的教育资源，包括电子书籍、考试题目和复习资料等。
                    </li>
                    <li>
                        BYR Docs 是一个开源项目，你可以在 <A href="https://github.com/byrdocs" >GitHub</A> 上找到我们的代码和数据。
                    </li>
                    <li>
                        如果您有任何问题或建议、想要贡献资料或者加入我们，请发送邮件至
                        <A href="mailto:contact@byrdocs.org" >contact@byrdocs.org</A>或在
                        <A href="https://github.com/orgs/byrdocs/discussions">GitHub Discussions</A>
                        留言。
                    </li>
                </div>
                <div className="w-full mt-12 text-center text-blue-500 hover:text-blue-400">
                    {idx ? 
                        <Link onClick={() => history.go(-1)} to="/about">返回</Link> :
                        <Link to="/">首页</Link>
                    }
                </div>
            </div>
        </div>
    );
}