import { useState } from 'react'

function Modal({ gameStatus, closeModal, currentWord, guesses }) {
	const [copied, setCopied] = useState(false)

	const newGuesses = guesses.slice(1)

	const createEmojiGrid = newGuesses.map((g) => {
		let split = g.split('-')
		console.log(split)
		return split[1]
			.split('')
			.map((e) => {
				if (e === 'G') {
					return '🟩'
				} else if (e === 'Y') {
					return '🟨'
				} else if (e === 'S') {
					return '⬜'
				}
			})
			.join('')
	})

	const handleShare = () => {
		navigator.clipboard.writeText(
			`Star Wars\nWordle ${guesses.length}/6\n\n${createEmojiGrid.join(
				'\n'
			)}\n🟩🟩🟩🟩🟩`
		)
		setCopied(true)
	}

	return (
		<div className='h-80 w-80 bg-slate-700 z-50 rounded-md shadow-lg flex flex-col justify-center text-center relative items-center top-0 border-2 border-slate-600'>
			{console.log(guesses)}
			{gameStatus === 'WIN' ? (
				<>
					<h1 className='font-bold text-xl text-slate-300 absolute top-0 p-5'>
						"Obi-Wan has taught you well"
					</h1>
					<button
						className='bg-green-600 hover:bg-green-700 text-slate-300 h-10 w-20 rounded-md font-semibold'
						onClick={handleShare}
					>
						{copied ? 'COPIED' : 'SHARE'}
					</button>
				</>
			) : (
				<>
					<h1 className='font-bold text-xl text-slate-300 absolute top-0 p-5'>
						"You still hanging around with this loser?"
					</h1>
					<h1 className='font-semibold text-slate-300'>The word was </h1>
					<h1 className='font-bold text-lg text-red-500'>{currentWord}</h1>
				</>
			)}

			<button
				className='hover:text-green-500 text-slate-300 font-semibold absolute bottom-0 p-2'
				onClick={closeModal}
			>
				Try Again
			</button>
		</div>
	)
}

export default Modal
