import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';

interface Photo {
	id: number;
	title: string;
	url: string;
	thumbnailUrl: string;
}

const fetchPhotos = async ({ pageParam = 1 }: QueryFunctionContext): Promise<Photo[]> => {
	const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${pageParam}&_limit=10`);
	return res.json();
};

const InfiniteScroll: React.FC = () => {
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery<Photo[], Error>({
		initialData: undefined, initialPageParam: undefined,
		queryKey: ['photos'],
		queryFn: fetchPhotos,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length ? allPages.length + 1 : undefined;
		}
	});
	
	const observerRef = useRef<HTMLDivElement | null>(null);
	
	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasNextPage) {
				fetchNextPage();
			}
		});
		
		if (observerRef.current) {
			observer.observe(observerRef.current);
		}
		
		return () => {
			if (observerRef.current) {
				observer.unobserve(observerRef.current);
			}
		};
	}, [fetchNextPage, hasNextPage]);
	
	if (error) return <div>Failed to load</div>;
	
	return (
		<div>
			<h1>Infinite Scroll</h1>
			<div>
				{data?.pages.map((page, i) => (
					<React.Fragment key={i}>
						{page.map((photo: Photo) => (
							<div key={photo.id}>
								<img src={photo.thumbnailUrl} alt={photo.title} />
								<p>{photo.title}</p>
							</div>
						))}
					</React.Fragment>
				))}
			</div>
			{isFetchingNextPage && <p>Loading more...</p>}
			<div ref={observerRef} style={{ height: '1px' }}></div>
		</div>
	);
};

export default InfiniteScroll;
