import './App.css';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { storeDataAction } from './redux/Data/data.actions';
import Loading from './components/Loading.js';

const ShowItems = (props) => {
	const [item, setItem] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		setIsLoading(true);
		fetch(`https://reqres.in/api/users/${props.page}`)
			.then((res) => res.json())
			.then((res) => {
				setIsLoading(false);
				setItem(res.data);
			})
			.catch((err) => {
				setIsLoading(false);
				alert(err.message);
				console.log(err.message);
			});
	}, [props.page]);
	// return data.map((item) => (
	// 	<li key={item.id}>
	// 		{item.id}
	// 		<div>
	// 			<img src={item?.avatar} alt='' height='40' />
	// 		</div>
	// 		<div>
	// 			<span>
	// 				<strong>Name:</strong> {item?.first_name} {item?.last_name}
	// 			</span>
	// 		</div>
	// 		<span>
	// 			<strong>Email:</strong> {item?.email}
	// 		</span>
	// 	</li>
	// ));
	return !isLoading ? (
		Object.keys(item).length > 0 && (
			<li key={item.id}>
				<div className='name-title'>
					<span>
						{item?.first_name} {item?.last_name}
					</span>
				</div>
				<div style={{ padding: '2rem', display: 'flex', flexDirection: 'row' }}>
					<div style={{ flexGrow: '1' }}>
						<img src={item?.avatar} alt='' width='80px' />
					</div>
					<div style={{ display: 'grid', gridGap: '1rem', gridTemplateColumns: '1fr 1fr', textAlign: 'left', padding: ' 0 3rem', fontSize: '20px' }}>
						<span>#</span> <span>{item?.id}</span>
						<span>@</span> <span>{item?.email}</span>
					</div>
				</div>
			</li>
		)
	) : (
		<li>
			<Loading />
		</li>
	);
};

export default function App() {
	const dispatch = useDispatch();
	const [data, setData] = useState([]);
	const [totalLength, setTotalLength] = useState(0);
	const [page, setPage] = useState(1);
	const [perPage] = useState(1);
	const [pageLimit, setPageLimit] = useState(5);
	const [minPage, setMinPage] = useState(0);
	const [maxPage, setMaxPage] = useState(5);
	const [initalLoad, setInitialLoad] = useState(true);
	const [initialValue, setInitialValue] = useState();
	let sendData = [];
	const pages = [];

	pages.length = 0;
	for (let i = 1; i <= totalLength / perPage; i++) {
		pages.push(i);
	}
	let lastIndex = Number(perPage) * Number(page);
	let firstIndex = Number(lastIndex) - Number(perPage);
	sendData = data.slice(firstIndex, lastIndex);
	// console.log('sendData + ',sendData , firstIndex, lastIndex)

	useEffect(() => {
		fetch('https://reqres.in/api/users')
			.then((res) => res.json())
			.then((res) => {
				dispatch(storeDataAction(res.data));
				// setData(res.data);
				setTotalLength(res.total);
			});
	}, []);

	const handleChangePage = (e) => {
		setPage(Number(e.target.id));
	};
	const handleNextClick = () => {
		if (page < totalLength / perPage && !initalLoad) {
			setPage((prev) => Number(prev) + 1);
			if (page >= maxPage) {
				setMaxPage(maxPage + pageLimit);
				setMinPage(minPage + pageLimit);
			}
		}
	};
	const handlePrevClick = () => {
		if (page > 1 && !initalLoad) {
			setPage((prev) => Number(prev) - 1 || 1);
			if ((page - 1) % pageLimit === 0) {
				setMaxPage(maxPage - pageLimit);
				setMinPage(minPage - pageLimit);
			}
		}
	};
	const pageList = pages.map((i) => {
		if (i > minPage && i < maxPage + 1) {
			return (
				<li key={i} id={i} className={i === page && !initalLoad ? 'active' : ''} onClick={handleChangePage}>
					{i}
				</li>
			);
		}
	});
	const handleChangeLimit = (e) => {
		setPageLimit(Number(e.target.value));
		setMaxPage(Number(e.target.value));
	};
	const handleId = (e) => {
		setInitialValue(e.target.value);
	};
	const handleClick = (e) => {
		e.preventDefault();
		setPage(Number(initialValue));
		setInitialLoad(false);
		const last =
			(Number(initialValue) % pageLimit == 0
				? Math.floor(Number(initialValue) / Number(pageLimit))
				: Math.floor(Number(initialValue) / Number(pageLimit)) + 1) * pageLimit;
		const first = last - pageLimit;
		// console.log(last, first);
		setMaxPage(last);
		setMinPage(first);
	};
	return (
		<div className='App'>
			{/* <a class='developer' style={{ cursor: 'pointer', textDecoration: 'none' }} target='_blank' href={'https://www.linkedin.com/in/kavan-dalal/'}>
				&lt; Kavan Dalal &#47;&gt;
			</a> */}
			<ul className='singleDetails'>
				{initalLoad ? (
					<li className='form-main'>
						<form action='' onSubmit={handleClick}>
							<div>
								<input type='number' min='1' max={totalLength} value={initialValue} onChange={handleId} placeholder='Write ID to see first' />
							</div>
							<div>
								<button className='submitBtn' type='submit'>
									Submit
								</button>
							</div>
						</form>
					</li>
				) : (
					<ShowItems page={page} />
				)}
			</ul>
			<ul className='pagination'>
				<li onClick={handlePrevClick} type='button' className={page === 1 ? 'disable-cursor' : ''}>
					&lt;
				</li>
				{pages.length > 0 && pageList}
				<li onClick={handleNextClick} type='button' className={totalLength / perPage === page ? 'disable-cursor' : ''}>
					&gt;
				</li>
			</ul>
		</div>
	);
}
