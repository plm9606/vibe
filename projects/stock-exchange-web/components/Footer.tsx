import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/60 mt-auto">
      <div className="max-w-2xl mx-auto px-5 py-8">
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">홈</Link>
          <Link href="/guide" className="hover:text-white transition-colors">투자 가이드</Link>
          <Link href="/glossary" className="hover:text-white transition-colors">투자 용어 사전</Link>
          <Link href="/faq" className="hover:text-white transition-colors">자주 묻는 질문</Link>
          <Link href="/about" className="hover:text-white transition-colors">서비스 소개</Link>
        </nav>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">개인정보처리방침</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-gray-400 transition-colors">이용약관</Link>
          <span>·</span>
          <a href="mailto:mijang.calculator@gmail.com" className="hover:text-gray-400 transition-colors">문의</a>
        </div>
        <p className="text-center text-gray-700 text-xs mt-4">
          &copy; {new Date().getFullYear()} 미장 환율 계산기. 투자 참고용이며 투자 조언이 아닙니다.
        </p>
      </div>
    </footer>
  );
}
