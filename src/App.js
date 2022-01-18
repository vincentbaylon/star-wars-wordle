import { useState, useEffect } from 'react'
import './App.css'
import words from './Words'
import letters from './Letters'

function App() {
	const [currentWord, setCurrentWord] = useState('')
	const [currentGuess, setCurrentGuess] = useState('')
	const [guesses, setGuesses] = useState([currentGuess])
	const [gameStatus, setGameStatus] = useState('')

	const firstRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
	const secondRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
	const thirdRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M']

	useEffect(() => {
		let randomWord = words[Math.floor(Math.random() * words.length)]
		setCurrentWord(randomWord)
	}, [])

	const handleDelete = () => {
		if (gameStatus === '') {
			setCurrentGuess(currentGuess.slice(0, -1))
		} else {
		}
	}

	const handleEnter = () => {
		if (currentGuess.length === 5) {
			if (gameStatus === '') {
				if (currentGuess === currentWord) {
					setGameStatus('WIN')
				} else {
					let colors = 'WWWWW'

					let hash = {}

					for (const char of currentWord.split('')) {
						hash[char] = (hash[char] || 0) + 1
					}

					for (let i = 0; i < currentGuess.length; i++) {
						if (hash[currentGuess[i]] && currentGuess[i] === currentWord[i]) {
							letters[currentGuess[i]].correct = true
							hash[currentGuess[i]]--
							colors = colors.split('')
							colors[i] = 'G'
							colors = colors.join('')
							console.log('G', colors)
						}
					}

					for (let i = 0; i < currentGuess.length; i++) {
						if (
							hash[currentGuess[i]] &&
							currentWord.indexOf(currentGuess[i]) !== -1
						) {
							letters[currentGuess[i]].present = true
							hash[currentGuess[i]]--
							colors = colors.split('')
							colors[i] = 'Y'
							colors = colors.join('')
							console.log('Y', colors)
						} else if (colors[i] === 'W' && hash[currentGuess[i]] === 0) {
							colors = colors.split('')
							colors[i] = 'S'
							colors = colors.join('')
							console.log('Z', colors)
						} else if (
							colors[i] === 'W' &&
							currentWord.indexOf(currentGuess[i]) === -1
						) {
							letters[currentGuess[i]].absent = true
							colors = colors.split('')
							colors[i] = 'S'
							colors = colors.join('')
							console.log('S', colors)
						}
					}
					console.log(colors)
					setGuesses([...guesses, `${currentGuess}-${colors}`])
					setCurrentGuess('')
					console.log(guesses)
				}
			}
		}
	}

	const handleChar = (c) => {
		if (currentGuess.length < 5 && guesses.length < 7) {
			setCurrentGuess(`${currentGuess}${c}`)
		}
	}

	useEffect(() => {}, [gameStatus])

	useEffect(() => {
		const listener = (e) => {
			if (e.code === 'Enter') {
				handleEnter()
			} else if (e.code === 'Backspace') {
				handleDelete()
			} else {
				const key = e.key.toUpperCase()
				if (key.length === 1 && key >= 'A' && key <= 'Z') {
					handleChar(key)
				}
			}
		}
		window.addEventListener('keyup', listener)
		return () => {
			window.removeEventListener('keyup', listener)
		}
	}, [handleChar, handleEnter, handleDelete])

	const handleClick = (e) => {
		if (e.target.value === 'ENTER') {
			handleEnter()
		} else if (e.target.value === 'DELETE') {
			handleDelete()
		} else {
			handleChar(e.target.value)
		}
	}

	const splitGuess = currentGuess.split('')
	const emptyTiles = Array.from(Array(5 - splitGuess.length))
	const onlyEmptyTiles = Array.from(Array(5))

	const displayTiles = splitGuess.map((g) => {
		if (gameStatus === 'WIN') {
			return (
				<div
					key={g}
					className='flex justify-center items-center font-bold text-3xl md:text-4xl h-12 w-12 md:h-20 md:w-20 border-2 border-slate-700 bg-green-500'
				>
					<h1 className='text-white'>{g}</h1>
				</div>
			)
		} else {
			return (
				<div
					key={g}
					className='flex justify-center items-center font-bold text-3xl md:text-4xl h-12 w-12 md:h-20 md:w-20 border-2 border-slate-700'
				>
					<h1 className='text-white'>{g}</h1>
				</div>
			)
		}
	})

	const displayEmptyTiles = emptyTiles.map((_, i) => {
		return (
			<div
				key={i}
				className='h-12 w-12 md:h-20 md:w-20 border-2 border-slate-700'
			></div>
		)
	})

	const displayOnlyEmptyTiles = onlyEmptyTiles.map((_, i) => {
		return (
			<div
				key={i}
				className='h-12 w-12 md:h-20 md:w-20 border-2 border-slate-700'
			></div>
		)
	})

	const displayCurrentRow = [currentGuess].map((t) => {
		return (
			<div key={t} className='flex flex-row gap-1'>
				{displayTiles}
				{displayEmptyTiles}
			</div>
		)
	})

	const displayRows = guesses.map((g, i) => {
		let split = ['']

		if (g.length > 0) {
			split = g.split('-')
		}

		return (
			<div key={i} className='flex flex-row gap-1'>
				{split[0].split('').map((e, i) => {
					if (split[1][i] === 'G') {
						return (
							<div
								key={e}
								className='flex justify-center items-center font-bold text-3xl md:text-4xl h-12 w-12 md:h-20 md:w-20 border-2 border-green-700 bg-green-500'
							>
								<h1 className='text-white'>{e}</h1>
							</div>
						)
					} else if (split[1][i] === 'Y') {
						return (
							<div
								key={e}
								className='flex justify-center items-center font-bold text-3xl md:text-4xl h-12 w-12 md:h-20 md:w-20 border-2 border-slate-700 bg-yellow-500'
							>
								<h1 className='text-white'>{e}</h1>
							</div>
						)
					} else if (split[1][i] === 'S') {
						return (
							<div
								key={e}
								className='flex justify-center items-center font-bold text-3xl md:text-4xl h-12 w-12 md:h-20 md:w-20 border-2 border-slate-700 bg-slate-900'
							>
								<h1 className='text-white'>{e}</h1>
							</div>
						)
					}
				})}
			</div>
		)
	})

	const emptyRows = Array.from(Array(6 - guesses.length))

	const displayEmptyRows = emptyRows.map((_, i) => {
		return (
			<div key={i} className='flex flex-row gap-1'>
				{displayOnlyEmptyTiles}
			</div>
		)
	})

	const displayRow = (row) =>
		row.map((e) => {
			if (letters[e].correct === true) {
				return (
					<button
						key={e}
						value={e}
						className='h-8 w-6 md:h-10 md:w-8 lg:h-12 lg:w-10 rounded-sm text-white bg-green-500 font-semibold drop-shadow-lg'
						onClick={handleClick}
					>
						{e}
					</button>
				)
			} else if (letters[e].present === true) {
				return (
					<button
						key={e}
						value={e}
						className='h-8 w-6 md:h-10 md:w-8 lg:h-12 lg:w-10 rounded-sm text-white bg-yellow-500 font-semibold drop-shadow-lg'
						onClick={handleClick}
					>
						{e}
					</button>
				)
			} else if (letters[e].absent === true) {
				return (
					<button
						key={e}
						value={e}
						className='h-8 w-6 md:h-10 md:w-8 lg:h-12 lg:w-10 rounded-sm text-white bg-slate-900 font-semibold drop-shadow-lg'
						onClick={handleClick}
					>
						{e}
					</button>
				)
			} else {
				return (
					<button
						key={e}
						value={e}
						className='h-8 w-6 md:h-10 md:w-8 lg:h-12 lg:w-10 rounded-sm text-white bg-slate-500 font-semibold drop-shadow-lg'
						onClick={handleClick}
					>
						{e}
					</button>
				)
			}
		})

	return (
		<div className='flex flex-col items-center justify-center h-full min-h-screen star-background relative'>
			<h1 className='p-5 text-xl md:text-4xl font-bold text-slate-300 absolute top-0'>
				STAR WARS WORDLE
			</h1>
			<div className='flex items-center h-full absolute'>
				<div className='flex flex-col gap-1'>
					{displayRows}
					{displayCurrentRow}
					{displayEmptyRows}
				</div>
			</div>
			<div className='p-5 absolute bottom-0 items-center flex flex-col gap-1'>
				<div className='flex flex-row gap-1'>{displayRow(firstRow)}</div>
				<div className='flex flex-row gap-1'>{displayRow(secondRow)}</div>
				<div className='flex flex-row gap-1'>
					<button
						value='ENTER'
						className='h-8 w-14 md:h-10 md:w-14 lg:h-12 lg:w-16 rounded-sm text-white bg-slate-500 font-semibold drop-shadow-lg'
						onClick={handleClick}
					>
						ENTER
					</button>
					{displayRow(thirdRow)}
					<button
						value='DELETE'
						className='h-8 w-12 md:h-10 md:w-14 lg:h-12 lg:w-16 rounded-sm text-white bg-slate-500 font-semibold drop-shadow-lg'
						onClick={handleClick}
					>
						DEL
					</button>
				</div>
			</div>
		</div>
	)
}

export default App
