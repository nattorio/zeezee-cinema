import CastCard from './CastCard';

function CardGrid({ castList  }) {
    return (
        <div className="flex flex-col items-center w-full mt-[30px] mx-2 ">
            <div className="flex flex-col items-start max-w-5xl">
                <p className="font-bold text-2xl mb-4">출연/제작</p>
                <article className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-center">
                    {castList.slice(0, 12).map((c) => (
                        <CastCard key={c.id} data={c} />
                        
                    ))}
                </article>
            </div>
        </div>
    );
}

export default CardGrid;
