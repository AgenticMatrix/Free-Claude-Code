import { useRef } from 'react';
import { Box, Text } from 'ink';

interface InputBoxProps {
  inputText: string;
  cursorPosition: number;
  isStreaming: boolean;
}

let pasteIdCounter = 0;

/**
 * Renders the text input line at the bottom of the chat.
 *
 * When the input spans more than 2 lines (e.g. pasted table), it is collapsed
 * into a single-line preview so it doesn't consume the terminal.  The full
 * text is still sent on Enter.
 */
export function InputBox({ inputText, cursorPosition, isStreaming }: InputBoxProps) {
  const lines = inputText.split(/\r?\n|\r/);
  const isMultiLine = lines.length > 2;

  // Assign a stable paste ID when the input first becomes multi-line.
  const pasteIdRef = useRef(0);
  const wasMultiLineRef = useRef(false);
  if (isMultiLine && !wasMultiLineRef.current) {
    pasteIdCounter += 1;
    pasteIdRef.current = pasteIdCounter;
  }
  wasMultiLineRef.current = isMultiLine;

  // ── Compact preview for pasted / multi-line input ──────────
  if (isMultiLine) {
    const firstLine = lines[0].length > 50
      ? lines[0].slice(0, 47) + '...'
      : lines[0];

    return (
      <Box
        paddingX={1}
        paddingY={0}
        borderStyle="single"
        borderColor="grey"
        flexDirection="row"
      >
        <Box marginRight={1}>
          <Text color="cyan" bold>{'>'}</Text>
        </Box>
        <Text dimColor>
          [Pasted text #{pasteIdRef.current} +{lines.length - 1} lines]
        </Text>
        <Text> {firstLine}</Text>
        {isStreaming && (
          <Box marginLeft={1}>
            <Text dimColor color="yellow">(AI thinking...)</Text>
          </Box>
        )}
      </Box>
    );
  }

  // ── Normal single-line input ───────────────────────────────
  const beforeCursor = inputText.slice(0, cursorPosition);
  const afterCursor = inputText.slice(cursorPosition);

  return (
    <Box
      paddingX={1}
      paddingY={0}
      borderStyle="single"
      borderColor="grey"
      flexDirection="row"
    >
      <Box marginRight={1}>
        <Text color="cyan" bold>
          {'>'}
        </Text>
      </Box>
      <Box flexGrow={1}>
        <Text>
          {beforeCursor}
          {!isStreaming && (
            <Text color="cyan" dimColor>
              ▌
            </Text>
          )}
          {afterCursor}
        </Text>
      </Box>
      {isStreaming && (
        <Box marginLeft={1}>
          <Text dimColor color="yellow">
            (AI thinking...)
          </Text>
        </Box>
      )}
    </Box>
  );
}
