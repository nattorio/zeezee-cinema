function CastCard({ data }) {
    return (
        <div className="flex flex-row">
            <div className="min-w-[100px] aspect-square rounded-md overflow-hidden">
                <img
                    src={
                        data.profile_path ? `https://image.tmdb.org/t/p/w185${data.profile_path}` : '/assets/error.png'
                    }
                    alt={data.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="ml-[12px] flex flex-col gap-1">
                <p className="font-semibold">{data.name}</p>
                <p>{data.known_for_department}</p>
            </div>
        </div>
    );
}

export default CastCard;
