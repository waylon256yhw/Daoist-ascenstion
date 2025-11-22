import React from 'react';

interface RichTextProps {
  text: string;
  className?: string;
}

export const RichText: React.FC<RichTextProps> = ({ text, className = '' }) => {
  const formatText = (content: string) => {
    // 按换行分割
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, lineIndex) => {
      // 空行 = 段落间距
      if (line.trim() === '') {
        elements.push(<div key={lineIndex} className="h-3" />);
        return;
      }

      // 处理行内格式
      const segments: React.ReactNode[] = [];
      let currentIndex = 0;

      // 扩展正则：
      // 「对话」『重要对话』"英文引号" 【技能/系统】《典籍/功法》
      // **粗体** *斜体/心理* (AI推演:...)
      const regex = /「([^」]*)」|『([^』]*)』|"([^"]*)"|'([^']*)'|【([^】]*)】|《([^》]*)》|\*\*([^*]*)\*\*|\*([^*]*)\*|\(AI推演[：:][^)]*\)/g;
      let match;

      while ((match = regex.exec(line)) !== null) {
        // 添加匹配前的普通文本
        if (match.index > currentIndex) {
          segments.push(
            <span key={`text-${lineIndex}-${currentIndex}`}>
              {line.substring(currentIndex, match.index)}
            </span>
          );
        }

        // 格式化匹配内容
        if (match[0].startsWith('「')) {
          // 中文引号「」- 翡翠色对话
          segments.push(
            <span
              key={`quote-${lineIndex}-${match.index}`}
              className="text-emerald-300 font-medium"
            >
              {match[0]}
            </span>
          );
        } else if (match[0].startsWith('『')) {
          // 重要对话『』- 金色高亮
          segments.push(
            <span
              key={`quote2-${lineIndex}-${match.index}`}
              className="text-amber-300 font-bold drop-shadow-[0_0_3px_rgba(251,191,36,0.4)]"
            >
              {match[0]}
            </span>
          );
        } else if (match[0].startsWith('"') || match[0].startsWith("'")) {
          // 英文引号 - 青色
          segments.push(
            <span
              key={`quote-en-${lineIndex}-${match.index}`}
              className="text-cyan-300"
            >
              {match[0]}
            </span>
          );
        } else if (match[0].startsWith('【')) {
          // 【技能/系统提示】- 紫色标签风格
          segments.push(
            <span
              key={`skill-${lineIndex}-${match.index}`}
              className="text-violet-300 font-bold bg-violet-950/40 px-1 py-0.5 rounded text-[0.95em]"
            >
              {match[0]}
            </span>
          );
        } else if (match[0].startsWith('《')) {
          // 《典籍/功法名》- 琥珀色书名
          segments.push(
            <span
              key={`book-${lineIndex}-${match.index}`}
              className="text-amber-400 font-title tracking-wide"
            >
              {match[0]}
            </span>
          );
        } else if (match[0].startsWith('**')) {
          // **粗体** - 白色加粗，微光
          segments.push(
            <strong
              key={`bold-${lineIndex}-${match.index}`}
              className="text-white font-bold drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
            >
              {match[7]}
            </strong>
          );
        } else if (match[0].startsWith('*')) {
          // *斜体/心理描写* - 灰蓝斜体
          segments.push(
            <em
              key={`italic-${lineIndex}-${match.index}`}
              className="text-slate-400 italic"
            >
              {match[8]}
            </em>
          );
        } else if (match[0].startsWith('(AI推演')) {
          // AI 系统提示 - 小字暗色
          segments.push(
            <span
              key={`system-${lineIndex}-${match.index}`}
              className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded"
            >
              {match[0]}
            </span>
          );
        }

        currentIndex = match.index + match[0].length;
      }

      // 添加剩余文本
      if (currentIndex < line.length) {
        segments.push(
          <span key={`text-${lineIndex}-${currentIndex}`}>
            {line.substring(currentIndex)}
          </span>
        );
      }

      elements.push(
        <p key={lineIndex} className="mb-3 leading-[1.9] text-justify">
          {segments.length > 0 ? segments : line}
        </p>
      );
    });

    return elements;
  };

  return (
    <div className={`font-serif text-base sm:text-lg text-slate-200/95 ${className}`}>
      {formatText(text)}
    </div>
  );
};
