const caulateList = document.querySelector('#caulate-panel').children
const buttonList = document.querySelector('#function').children
const numberGroup = document.querySelector('#number-group')
const anser = document.querySelector('#anser')
// 每次随机生成0-3的计算规则
// 0：加法，1：减法，2：乘法，3除法
let caulateRules = 0
let firstCode = 0
let secendCode = 0
let trueResult = 0
let rulesSymbol = ''
let errorCount = 0
let maxMath = 100
let lastResult = '0'

function randomCaulte() {
  // 清空答案
  anser.innerText='看看答案'
  caulateList[3].value = 0
  // 错误次数置为0
  errorCount = 0
  // 生成计算规则
  caulateRules = Math.round(Math.random() * 3)
  // 生成100以内的加减乘除法
  firstCode = Math.round(Math.random() * maxMath)
  secendCode = Math.round(Math.random() * maxMath)

  if (caulateRules === 3) {
    // 优化除法计算难度
    divisionCheck()
  }

  //  获取正确结果
  trueResult = getResult(firstCode, secendCode, caulateRules)
  console.log(trueResult)
  // 渲染数字和符号
  caulateList[0].innerText = firstCode
  caulateList[1].innerText = rulesSymbol
  caulateList[2].innerText = secendCode
}

function getResult(firstValue, secendValue, rules) {
  switch (rules) {
    case 0:
      rulesSymbol = '+'
      return firstValue + secendValue
    case 1:
      rulesSymbol = '-'
      return firstValue - secendValue
    case 2:
      rulesSymbol = '*'
      return firstValue * secendValue
    case 3:
      rulesSymbol = '/'
      return firstValue / secendValue
  }
}

function divisionCheck() {
  // 除数不能为0，为0就重新生成除数
  if (!secendCode) {
    console.log('除数不能为0!')
    secendCode = Math.round(Math.random() * maxMath)
    divisionCheck()
  }
  // 检验当前计算结果是否复杂
  const result = firstCode / secendCode + ''
  // 获取小数点后面的长度（不包括小数点）
  const length = result.slice(result.indexOf('.')).length - 1
  // 计算结果小数点超过4位就重新生成数字
  if (length > 4) {
    // 重新生成两个数字
    console.log('计算结果太复杂了!' + result)
    firstCode = Math.round(Math.random() * maxMath)
    secendCode = Math.round(Math.random() * maxMath)
    divisionCheck()
  } else {
    return
  }
}

function submit() {
  // 获取当前的结果
  const result = caulateList[3].value
  if (!result.length) {
    alert('输入的内容不能为空!')
    return
  }
  const resultMath = +result
  // 若是nan就提示输入非法
  if (isNaN(resultMath)) {
    alert('输入的内容非法!')
    return
  }
  if (resultMath === trueResult) {
    alert('正确!')
    caulateList[3].value = 0
    randomCaulte()
  } else {
    caulateList[3].value = 0
    errorCount++
    if (errorCount > 3) {
      if (confirm('错误！是不是太难了需要换一道题?')) {
        randomCaulte()
      }
    } else {
      alert('错误!')
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  caulateList[3].value = 0
  randomCaulte()
  buttonList[0].addEventListener('click', randomCaulte)
  buttonList[1].addEventListener('click', submit)
  // 退格功能
  buttonList[2].addEventListener('click', () => {
    // 长度等于1就置0，长度大于1就退格
    if(caulateList[3].value.length>1){
      caulateList[3].value = caulateList[3].value.slice(0,caulateList[3].value.length - 1)
    } else if (caulateList[3].value.length===1){
      caulateList[3].value = 0
    }
  })
  // 输入框回车执行回调函数
  caulateList[3].addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      submit()
    }
  })
  // 数字按钮
  numberGroup.addEventListener('click', (event) => {
    if (event.target.className.includes('number-button')) {
      // 若当前是0应该覆盖0
      if (+caulateList[3].value === 0 && caulateList[3].value.length===1) {
        caulateList[3].value = event.target.innerText
      } else {
        // 检查第二个字符是否是0
        if(caulateList[3].value.charAt(1)==='0'){
          caulateList[3].value = caulateList[3].value.replace('0','')
        }
        caulateList[3].value += event.target.innerText
      }
    }
    lastResult=caulateList[3].value
  })
  // 清空输入的内容
  numberGroup.querySelector('#clear-button').addEventListener('click', () => {
    caulateList[3].value = 0
    lastResult=caulateList[3].value
  })
  // 负号
  numberGroup.querySelector('#negative-button').addEventListener('click', () => {
      if (caulateList[3].value.includes('-')) {
        console.log('有负号了!')
        return
      } else {
        // 在最前面插入符号
        caulateList[3].value = '-' + caulateList[3].value
      }
      lastResult=caulateList[3].value
    })
  // 禁止输入非数字内容
  caulateList[3].addEventListener('keyup', (event) => {
    if(event.key==='Backspace' || +event.key<10 || event.key==='.'){
      lastResult=caulateList[3].value
      console.log('允许输入')
    } else {
      caulateList[3].value =lastResult
    }
  })
  // 答案
  anser.addEventListener('click',()=>{
    const div = document.createElement('div')
    div.innerText=trueResult
    anser.insertAdjacentElement('beforeend',div)
  })
})
