import { RiCloseLine } from 'react-icons/ri'

function InfoModal({ closeInfoModal }) {
	return (
		<div className='p-5 h-40 w-80 bg-slate-700 z-50 rounded-md shadow-lg border-2 border-slate-600 flex flex-col justify-center text-center relative items-center top-0'>
			<button onClick={closeInfoModal} className='absolute top-0 right-0'>
				<RiCloseLine size={25} className='text-slate-400' />
			</button>
			<h1 className='text-slate-300 font-semibold pb-5'>
				If you do not know how to play please check out the original
			</h1>
			<a
				href='https://www.powerlanguage.co.uk/wordle/'
				target='_blank'
				rel='noreferrer noopener'
			>
				<h1 className='font-bold text-slate-300 hover:underline text-xl hover:text-green-500'>
					WORDLE
				</h1>
			</a>
		</div>
	)
}

export default InfoModal
