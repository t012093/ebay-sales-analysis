export function parseCSVData(text: string) {
  // CSVを行に分割（改行コードを考慮）
  const rows = text.split(/\r?\n/).filter(row => row.length > 0);
  
  // ヘッダー行を取得
  const headers = rows[0].split(',').map(header => header.trim());
  
  // データ行を処理
  const parsedData = rows.slice(1).map(row => {
    // カンマで分割する前に、引用符で囲まれた部分を一時的に置換
    let processedRow = row;
    const quotedValues: string[] = [];
    const quotedRegex = /"([^"]*)"/g;
    let match;
    
    while ((match = quotedRegex.exec(row)) !== null) {
      const placeholder = `__QUOTED_${quotedValues.length}__`;
      quotedValues.push(match[1]);
      processedRow = processedRow.replace(match[0], placeholder);
    }
    
    // カンマで分割
    const values = processedRow.split(',').map(value => value.trim());
    
    // プレースホルダーを元の値に戻す
    values.forEach((value, index) => {
      if (value?.startsWith('__QUOTED_')) {
        const quotedIndex = parseInt(value.match(/__QUOTED_(\d+)__/)?.[1] || '0');
        values[index] = quotedValues[quotedIndex];
      }
    });
    
    // オブジェクトを構築
    const item: { [key: string]: any } = {};
    headers.forEach((header, index) => {
      let value = values[index] || '';
      
      // 価格の処理
      if (header === '価格(USD)') {
        value = parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
      } else if (value.includes('円')) {
        // 円表示の価格を処理
        const numericValue = parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
        if (header === '価格(表示)') {
          value = `${numericValue.toLocaleString()} 円`;
        }
      }
      
      item[header] = value;
    });
    
    return item;
  });
  
  return parsedData;
}