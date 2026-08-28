'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Calculator, RotateCcw, X } from 'lucide-react'

interface CasioCalculatorModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CasioCalculatorModal({ isOpen, onClose }: CasioCalculatorModalProps) {
  const [display, setDisplay] = useState('0')
  const [formula, setFormula] = useState('')
  const [isDeg, setIsDeg] = useState(true)

  const handleClear = () => {
    setDisplay('0')
    setFormula('')
  }

  const handleDelete = () => {
    if (display.length <= 1 || display === 'Error') {
      setDisplay('0')
    } else {
      setDisplay(display.slice(0, -1))
    }
  }

  const handleDigit = (digit: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(digit)
    } else {
      setDisplay(display + digit)
    }
  }

  const handleOperator = (op: string) => {
    if (display === 'Error') return
    setFormula(display + ' ' + op + ' ')
    setDisplay('0')
  }

  const handleScientific = (fn: string) => {
    try {
      const num = parseFloat(display)
      if (isNaN(num)) return

      let res = 0
      switch (fn) {
        case 'sin':
          res = isDeg ? Math.sin((num * Math.PI) / 180) : Math.sin(num)
          break
        case 'cos':
          res = isDeg ? Math.cos((num * Math.PI) / 180) : Math.cos(num)
          break
        case 'tan':
          res = isDeg ? Math.tan((num * Math.PI) / 180) : Math.tan(num)
          break
        case 'sqrt':
          res = Math.sqrt(num)
          break
        case 'sqr':
          res = Math.pow(num, 2)
          break
        case 'log':
          res = Math.log10(num)
          break
        case 'ln':
          res = Math.log(num)
          break
        case 'pi':
          res = Math.PI
          break
        default:
          return
      }

      const formatted = Number(res.toFixed(6)).toString()
      setDisplay(formatted)
      setFormula(`${fn}(${num}) =`)
    } catch {
      setDisplay('Error')
    }
  }

  const handleEquals = () => {
    try {
      if (!formula) return
      const fullExpr = (formula + display)
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, `${Math.PI}`)

      // Safe arithmetic evaluator
      // eslint-disable-next-line no-new-func
      const result = Function(`'use strict'; return (${fullExpr})`)()
      const formatted = Number(Number(result).toFixed(6)).toString()
      setDisplay(formatted)
      setFormula('')
    } catch {
      setDisplay('Error')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="حاسبة كازيو العلمية (Casio FX-99 MS)"
      subtitle="حاسبة علمية دقيقة مدمجة لحساب المعادلات والنقاط أثناء الحصة والتصحيح"
      icon="🧮"
    >
      <div
        style={{
          background: '#e2e8f0',
          borderRadius: '20px',
          padding: '16px',
          border: '4px solid #94a3b8',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.15)',
          maxWidth: '380px',
          margin: '0 auto',
          fontFamily: 'Inter, monospace',
        }}
      >
        {/* Header Branding */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '11px', fontWeight: 900, color: '#475569' }}>
          <span>SCIENTIFIC CALCULATOR</span>
          <span>FX-99 MS</span>
        </div>

        {/* LCD Green Screen */}
        <div
          style={{
            background: '#a3c9a8',
            borderRadius: '10px',
            border: '3px solid #6b8f71',
            padding: '10px 14px',
            marginBottom: '14px',
            boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '75px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#2d4a32', fontWeight: 800 }}>
            <span>MTH</span>
            <span
              onClick={() => setIsDeg(!isDeg)}
              style={{ cursor: 'pointer', background: '#84b58b', padding: '1px 5px', borderRadius: '4px' }}
            >
              {isDeg ? 'DEG' : 'RAD'}
            </span>
          </div>

          <div style={{ fontSize: '11px', color: '#3d5c42', textAlign: 'right', minHeight: '14px' }}>
            {formula}
          </div>

          <div style={{ fontSize: '24px', fontWeight: 900, color: '#16281a', textAlign: 'right', overflowX: 'auto' }}>
            {display}
          </div>
        </div>

        {/* Keypad Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Scientific Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            <button className="casio-fn-btn" onClick={() => handleScientific('sin')}>sin</button>
            <button className="casio-fn-btn" onClick={() => handleScientific('cos')}>cos</button>
            <button className="casio-fn-btn" onClick={() => handleScientific('tan')}>tan</button>
            <button className="casio-fn-btn" onClick={() => handleScientific('log')}>log</button>
            <button className="casio-fn-btn" onClick={() => handleScientific('ln')}>ln</button>
          </div>

          {/* Scientific Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            <button className="casio-fn-btn" onClick={() => handleScientific('sqrt')}>√</button>
            <button className="casio-fn-btn" onClick={() => handleScientific('sqr')}>x²</button>
            <button className="casio-fn-btn" onClick={() => handleScientific('pi')}>π</button>
            <button className="casio-fn-btn" onClick={() => handleDigit('(')}>(</button>
            <button className="casio-fn-btn" onClick={() => handleDigit(')')}>)</button>
          </div>

          {/* Action Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            <button className="casio-op-btn" onClick={() => handleOperator('÷')}>÷</button>
            <button className="casio-op-btn" onClick={() => handleOperator('%')}>%</button>
            <button className="casio-del-btn" onClick={handleDelete}>DEL</button>
            <button className="casio-ac-btn" onClick={handleClear}>AC</button>
          </div>

          {/* Number Rows */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            <button className="casio-num-btn" onClick={() => handleDigit('7')}>7</button>
            <button className="casio-num-btn" onClick={() => handleDigit('8')}>8</button>
            <button className="casio-num-btn" onClick={() => handleDigit('9')}>9</button>
            <button className="casio-op-btn" onClick={() => handleOperator('×')}>×</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            <button className="casio-num-btn" onClick={() => handleDigit('4')}>4</button>
            <button className="casio-num-btn" onClick={() => handleDigit('5')}>5</button>
            <button className="casio-num-btn" onClick={() => handleDigit('6')}>6</button>
            <button className="casio-op-btn" onClick={() => handleOperator('-')}>-</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            <button className="casio-num-btn" onClick={() => handleDigit('1')}>1</button>
            <button className="casio-num-btn" onClick={() => handleDigit('2')}>2</button>
            <button className="casio-num-btn" onClick={() => handleDigit('3')}>3</button>
            <button className="casio-op-btn" onClick={() => handleOperator('+')}>+</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            <button className="casio-num-btn" onClick={() => handleDigit('0')}>0</button>
            <button className="casio-num-btn" onClick={() => handleDigit('.')}>.</button>
            <button className="casio-num-btn" onClick={() => handleDigit('00')}>00</button>
            <button className="casio-eq-btn" onClick={handleEquals}>=</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
