function UserReview() {
    // 받아올거: 유저 이미지, 유저 이름, 유저 평점, 유저 코멘트, 해당 글 좋아요, 댓글

    return (
        <article>
            <header className="flex">
                <div>
                    <img src="" alt="" />
                    <p>username</p>
                </div>
                <span>star</span>
            </header>
            <span>---</span>
            <main>
                <p>극장만이 선사하는 가치, 블록버스터의 존재 이유</p>
            </main>
            <span>---</span>
            <footer>
                <div>
                    <p>좋아요 1066</p>
                    <p>댓글2</p>
                </div>
                <div>
                    <div>
                        <button>따봉</button>
                        <button>댓글</button>
                        <button>공유</button>
                    </div>
                    <button>...</button>
                </div>
            </footer>
        </article>
    );
}

export default UserReview;
