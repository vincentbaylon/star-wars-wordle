import { useState, useEffect } from 'react'
import Modal from './Modal'
import InfoModal from './InfoModal'
import './App.css'
import words from './Words'
import letters from './Letters'
import { RiQuestionLine } from 'react-icons/ri'

function App() {
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [infoModalIsOpen, setInfoModalIsOpen] = useState(false)
	const [currentWord, setCurrentWord] = useState('')
	const [currentGuess, setCurrentGuess] = useState('')
	const [guesses, setGuesses] = useState([currentGuess])
	const [gameStatus, setGameStatus] = useState('')
	const [repeat, setRepeat] = useState(false)

	const firstRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
	const secondRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
	const thirdRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M']

	const closeModal = () => {
		let randomWord = words[Math.floor(Math.random() * words.length)]
		setCurrentWord(randomWord)

		let checkHash = {}

		for (const char of randomWord.split('')) {
			checkHash[char] = (checkHash[char] || 0) + 1
		}

		if (Object.keys(checkHash).length !== 5) {
			setRepeat(true)
		}

		setModalIsOpen(false)
		setCurrentGuess('')
		setGuesses([''])
		setGameStatus('')
	}

	useEffect(() => {
		let randomWord = words[Math.floor(Math.random() * words.length)]
		setCurrentWord(randomWord)

		let checkHash = {}

		for (const char of randomWord.split('')) {
			checkHash[char] = (checkHash[char] || 0) + 1
		}

		if (Object.keys(checkHash).length !== 5) {
			setRepeat(true)
		}
	}, [])

	useEffect(() => {
		if (gameStatus !== '') {
			setModalIsOpen(true)
		}
	}, [gameStatus])

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
						} else if (colors[i] === 'W' && hash[currentGuess[i]] === 0) {
							colors = colors.split('')
							colors[i] = 'S'
							colors = colors.join('')
						} else if (
							colors[i] === 'W' &&
							currentWord.indexOf(currentGuess[i]) === -1
						) {
							letters[currentGuess[i]].absent = true
							colors = colors.split('')
							colors[i] = 'S'
							colors = colors.join('')
						}
					}
					setGuesses([...guesses, `${currentGuess}-${colors}`])
					setCurrentGuess('')
				}
			}
		}
	}

	const handleChar = (c) => {
		if (currentGuess.length < 5 && guesses.length < 7) {
			setCurrentGuess(`${currentGuess}${c}`)
		}
	}

	useEffect(() => {
		if (guesses.length === 7 && gameStatus === '') {
			setGameStatus('LOSS')
		}
	}, [guesses])

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

	const displayCurrentRow =
		guesses.length < 7
			? [currentGuess].map((t) => {
					return (
						<div key={t} className='flex flex-row gap-1'>
							{displayTiles}
							{displayEmptyTiles}
						</div>
					)
			  })
			: null

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

	const emptyRows =
		guesses.length < 7 ? Array.from(Array(6 - guesses.length)) : null

	const displayEmptyRows =
		guesses.length < 7
			? emptyRows.map((_, i) => {
					return (
						<div key={i} className='flex flex-row gap-1'>
							{displayOnlyEmptyTiles}
						</div>
					)
			  })
			: null

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

	const handleInfo = () => {
		setInfoModalIsOpen(true)
	}

	const closeInfoModal = () => {
		setInfoModalIsOpen(false)
	}

	return (
		<div className='flex flex-col items-center justify-center h-full min-h-screen star-background relative'>
			<div className='p-5 absolute top-0 flex flex-row justify-center'>
				<h1 className='text-xl md:text-4xl font-bold text-slate-300 pr-10'>
					STAR WARS WORDLE
				</h1>
				<button
					className='text-lg hover:cursor-pointer z-50'
					onClick={handleInfo}
				>
					<RiQuestionLine size={27} color='gray' />
				</button>
			</div>

			{repeat ? (
				<h1 className='p-5 text-md md:text-lg font-medium text-slate-400 absolute top-14'>
					Two or more characters of current word repeat.
				</h1>
			) : null}
			{modalIsOpen ? (
				<div className='absolute top-20'>
					<Modal
						closeModal={closeModal}
						gameStatus={gameStatus}
						currentWord={currentWord}
						guesses={guesses}
					/>
				</div>
			) : null}
			{infoModalIsOpen ? (
				<div className='absolute top-20'>
					<InfoModal closeInfoModal={closeInfoModal} />
				</div>
			) : null}

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
