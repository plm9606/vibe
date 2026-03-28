#!/usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { fetchExchangeRate } from './exchangeApi';
import { fetchStockData } from './stockApi';
import { analyze } from './calculator';

function formatKrw(amount: number): string {
  return amount.toLocaleString('ko-KR', { maximumFractionDigits: 0 }) + '원';
}

function formatUsd(amount: number): string {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercent(value: number, withSign = true): string {
  const sign = withSign && value > 0 ? '+' : '';
  return sign + value.toFixed(2) + '%';
}

function printDivider() {
  console.log(chalk.gray('─'.repeat(52)));
}

async function main() {
  console.log();
  console.log(chalk.bold.cyan('  📈 미국 주식 환율 손익분기 계산기'));
  console.log(chalk.gray('  환율 고려 시 얼마나 더 떨어져야 이득인지 계산합니다'));
  console.log();

  // 종목 입력
  const { symbol } = await inquirer.prompt([
    {
      type: 'input',
      name: 'symbol',
      message: '주식 티커를 입력하세요 (예: AAPL, NVDA, TSLA):',
      validate: (v: string) => v.trim().length > 0 || '티커를 입력해주세요.',
      filter: (v: string) => v.trim().toUpperCase(),
    },
  ]);

  console.log();

  // 환율 & 주가 병렬 조회
  const spinner = ora('환율 및 주가 데이터 조회 중...').start();

  let exchangeData: Awaited<ReturnType<typeof fetchExchangeRate>>;
  let stockData: Awaited<ReturnType<typeof fetchStockData>>;

  try {
    [exchangeData, stockData] = await Promise.all([
      fetchExchangeRate(),
      fetchStockData(symbol),
    ]);
    spinner.succeed('데이터 조회 완료');
  } catch (err: unknown) {
    spinner.fail('데이터 조회 실패');
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`\n오류: ${message}`));
    process.exit(1);
  }

  console.log();

  // 계산
  const result = analyze({
    currentExchangeRate: exchangeData.current,
    avgExchangeRate: exchangeData.threeMonthAvg,
    currentStockPrice: stockData.currentPrice,
    avgStockPrice: stockData.threeMonthAvg,
  });

  // ── 환율 정보 ────────────────────────────────────
  printDivider();
  console.log(chalk.bold(' 💱 환율 (USD/KRW)'));
  printDivider();
  console.log(
    `  현재 환율       ${chalk.yellow(formatKrw(exchangeData.current))}`,
  );
  console.log(
    `  3개월 평균      ${chalk.gray(formatKrw(exchangeData.threeMonthAvg))}`,
  );

  const premium = result.exchangeRatePremiumPercent;
  const premiumStr = formatPercent(premium);
  const premiumColored =
    premium > 0 ? chalk.red(premiumStr) : chalk.green(premiumStr);
  console.log(`  평균 대비       ${premiumColored}`);

  // ── 주가 정보 ────────────────────────────────────
  console.log();
  printDivider();
  console.log(chalk.bold(` 📊 ${stockData.name} (${stockData.symbol})`));
  printDivider();
  console.log(
    `  현재 주가       ${chalk.yellow(formatUsd(stockData.currentPrice))}`,
  );
  console.log(
    `  3개월 평균 주가 ${chalk.gray(formatUsd(stockData.threeMonthAvg))}`,
  );
  console.log(
    `  현재가 KRW 환산 ${chalk.yellow(formatKrw(result.currentPriceKrw))}`,
  );
  console.log(
    `  평균가 KRW 환산 ${chalk.gray(formatKrw(result.avgPriceKrw))}`,
  );

  // ── 손익분기 분석 ────────────────────────────────
  console.log();
  printDivider();
  console.log(chalk.bold(' 🎯 손익분기 분석'));
  printDivider();

  if (result.isAlreadyGood) {
    console.log(chalk.green.bold('  ✅ 현재 가격이 이미 손익분기 아래입니다!'));
    console.log(
      chalk.green(
        `  지금 매수해도 3개월 평균 대비 유리한 조건입니다.`,
      ),
    );
  } else {
    console.log(
      `  손익분기 USD 주가  ${chalk.cyan.bold(formatUsd(result.breakEvenPriceUsd))}`,
    );
    console.log(
      `  현재 대비 필요 하락  ${chalk.red.bold(formatPercent(-result.requiredDropPercent, false) + ' 하락 필요')}`,
    );
    console.log();
    console.log(
      chalk.gray(
        `  현재 환율(${formatKrw(exchangeData.current)})이 3개월 평균(${formatKrw(exchangeData.threeMonthAvg)})보다`,
      ),
    );
    console.log(
      chalk.gray(
        `  ${premiumColored} 비싸기 때문에, 주가가 그만큼 더 내려야 본전입니다.`,
      ),
    );
  }

  printDivider();
  console.log();

  // 추가 분석 여부
  const { again } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'again',
      message: '다른 종목도 분석할까요?',
      default: false,
    },
  ]);

  if (again) {
    await main();
  } else {
    console.log(chalk.gray('\n  좋은 투자 하세요! 👋\n'));
  }
}

main().catch((err) => {
  console.error(chalk.red('예기치 않은 오류:'), err);
  process.exit(1);
});
