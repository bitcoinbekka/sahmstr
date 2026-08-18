/**
 * A small, dependency-free Markdown renderer.
 *
 * This deliberately replaces `react-markdown` and its deep tree of tiny ESM
 * packages (unified / remark / mdast / micromark / hast …). That tree does not
 * resolve cleanly under a real Rollup production build, and we only ever needed
 * a modest subset of Markdown for contributed community units. Rendering it
 * ourselves keeps the build simple and the output fully under our control.
 *
 * Supported, because it is what long-form contributed content uses:
 *   - headings (`#`–`######`)
 *   - unordered (`-`, `*`, `+`) and ordered (`1.`) lists
 *   - blockquotes (`>`)
 *   - fenced code blocks (```) and inline `code`
 *   - horizontal rules (`---`)
 *   - paragraphs
 *   - inline: **bold**, *italic*, `code`, and [links](url)
 *
 * Everything is rendered as plain React elements; no raw HTML from the source is
 * ever injected (there is no `dangerouslySetInnerHTML`), so contributed content
 * stays inert. Links open in a new tab with `nofollow ugc`, matching the prior
 * behaviour.
 */

import { Fragment, type ReactNode } from 'react';

/** Escape nothing — we never inject HTML — but split inline tokens safely. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let remaining = text;
  let i = 0;

  // Ordered by specificity. Each regex captures the token and its payload.
  const patterns: Array<{
    re: RegExp;
    render: (m: RegExpMatchArray, key: string) => ReactNode;
  }> = [
    {
      // [label](url)
      re: /\[([^\]]+)\]\(([^)\s]+)\)/,
      render: (m, key) => (
        <a
          key={key}
          href={m[2]}
          target="_blank"
          rel="noreferrer nofollow ugc"
        >
          {m[1]}
        </a>
      ),
    },
    {
      // **bold**
      re: /\*\*([^*]+)\*\*/,
      render: (m, key) => <strong key={key}>{m[1]}</strong>,
    },
    {
      // *italic* or _italic_
      re: /(?:\*([^*]+)\*|_([^_]+)_)/,
      render: (m, key) => <em key={key}>{m[1] ?? m[2]}</em>,
    },
    {
      // `inline code`
      re: /`([^`]+)`/,
      render: (m, key) => (
        <code
          key={key}
          className="rounded bg-muted px-1 py-0.5 text-[0.85em]"
        >
          {m[1]}
        </code>
      ),
    },
  ];

  while (remaining.length > 0) {
    // Find the earliest-matching pattern.
    let best: { index: number; length: number; node: ReactNode } | null = null;
    for (const { re, render } of patterns) {
      const m = remaining.match(re);
      if (m && m.index !== undefined) {
        if (best === null || m.index < best.index) {
          best = {
            index: m.index,
            length: m[0].length,
            node: render(m, `${keyPrefix}-i${i}`),
          };
        }
      }
    }

    if (!best) {
      nodes.push(<Fragment key={`${keyPrefix}-t${i}`}>{remaining}</Fragment>);
      break;
    }

    if (best.index > 0) {
      nodes.push(
        <Fragment key={`${keyPrefix}-t${i}`}>
          {remaining.slice(0, best.index)}
        </Fragment>,
      );
      i += 1;
    }
    nodes.push(best.node);
    i += 1;
    remaining = remaining.slice(best.index + best.length);
  }

  return nodes;
}

/** Parse a full markdown string into React block elements. */
export function MiniMarkdown({ children }: { children: string }): ReactNode {
  const lines = children.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];

  let i = 0;
  let key = 0;
  const nextKey = () => `b${key++}`;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line — skip.
    if (line.trim() === '') {
      i += 1;
      continue;
    }

    // Fenced code block.
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1; // consume closing fence
      blocks.push(
        <pre
          key={nextKey()}
          className="overflow-x-auto rounded-lg bg-muted p-4 text-sm"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    // Horizontal rule.
    if (/^\s*(?:---|\*\*\*|___)\s*$/.test(line)) {
      blocks.push(<hr key={nextKey()} />);
      i += 1;
      continue;
    }

    // Heading.
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const content = renderInline(heading[2], `h${i}`);
      const Tag = (`h${level}` as keyof JSX.IntrinsicElements);
      blocks.push(<Tag key={nextKey()}>{content}</Tag>);
      i += 1;
      continue;
    }

    // Blockquote (consume consecutive `>` lines).
    if (/^\s*>/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ''));
        i += 1;
      }
      blocks.push(
        <blockquote key={nextKey()}>
          {renderInline(quoteLines.join(' '), `q${i}`)}
        </blockquote>,
      );
      continue;
    }

    // Unordered list.
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ul key={nextKey()}>
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it, `ul${i}-${idx}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list.
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ol key={nextKey()}>
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it, `ol${i}-${idx}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Paragraph — gather consecutive non-blank, non-special lines.
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !/^\s*>/.test(lines[i]) &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*(?:---|\*\*\*|___)\s*$/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={nextKey()}>{renderInline(paraLines.join(' '), `p${i}`)}</p>,
    );
  }

  return <>{blocks}</>;
}
