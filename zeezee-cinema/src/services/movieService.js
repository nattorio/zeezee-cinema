/**
 * TMDB (The Movie Database) API 클라이언트 라이브러리
 *
 * 사용법:
 * import TMDBApi, { createMovies } from './movieService.js';
 *
 * // 전체 API 사용
 * const tmdb = new TMDBApi(import.meta.env.VITE_TMDB_API_KEY);
 * const movies = await tmdb.getPopularMovies();
 *
 * // 특정 모듈만 사용
 * const moviesApi = createMovies(import.meta.env.VITE_TMDB_API_KEY);
 * const popularMovies = await moviesApi.getPopularMovies();
 */

// ==================== BASE API CLASS ====================
/**
 * TMDB API의 기본 클래스
 * 모든 API 요청의 공통 로직을 처리합니다.
 */
class TMDBApiBase {
    /**
     * TMDBApiBase 생성자
     * @param {string} apiKey - TMDB API 키 또는 Bearer 토큰
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.themoviedb.org/3';
        this.imageBaseUrl = 'https://image.tmdb.org/t/p';
    }

    /**
     * API 요청을 수행하는 공통 메서드
     * @param {string} endpoint - API 엔드포인트 (예: '/movie/popular')
     * @param {Object} params - 쿼리 매개변수 객체
     * @param {string} method - HTTP 메서드 (GET, POST, PUT, DELETE)
     * @param {Object|null} body - 요청 본문 (POST/PUT 요청 시 사용)
     * @returns {Promise<Object>} API 응답 데이터
     * @throws {Error} HTTP 에러 또는 네트워크 에러 시 예외 발생
     */
    async makeRequest(endpoint, params = {}, method = 'GET', body = null) {
        try {
            // URL 객체 생성으로 안전한 URL 구성
            const url = new URL(`${this.baseUrl}${endpoint}`);

            // GET 요청의 경우 쿼리 매개변수로 API 키와 파라미터 추가
            if (method === 'GET') {
                url.searchParams.append('api_key', this.apiKey);
                Object.keys(params).forEach((key) => {
                    // undefined나 null 값은 제외하고 매개변수 추가
                    if (params[key] !== undefined && params[key] !== null) {
                        url.searchParams.append(key, params[key]);
                    }
                });
            }

            // fetch 옵션 설정
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    // Bearer 토큰 방식도 지원 (API 키와 동일하게 사용)
                    Authorization: `Bearer ${this.apiKey}`,
                },
            };

            // POST/PUT 요청의 경우 본문 데이터 추가
            if (body) {
                options.body = JSON.stringify(body);
            }

            // API 요청 실행
            const response = await fetch(url, options);

            // HTTP 에러 체크
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // JSON 응답 파싱하여 반환
            return await response.json();
        } catch (error) {
            console.error('API 요청 실패:', error);
            throw error;
        }
    }
}

// ==================== MOVIES MODULE ====================
/**
 * 영화 관련 API 기능을 제공하는 모듈
 * @param {string} apiKey - TMDB API 키
 * @returns {Object} 영화 관련 메서드들을 포함한 객체
 */
export const createMovies = (apiKey) => {
    const apiBase = new TMDBApiBase(apiKey);

    return {
        /**
         * 영화 검색
         * @param {string} query - 검색할 영화 제목
         * @param {number} page - 페이지 번호 (기본값: 1)
         * @param {string} language - 언어 코드 (기본값: 'ko-KR')
         * @param {string|null} region - 지역 코드 (예: 'KR', 'US')
         * @param {number|null} year - 개봉 연도
         * @param {number|null} primaryReleaseYear - 주요 개봉 연도
         * @param {boolean} includeAdult - 성인 콘텐츠 포함 여부 (기본값: false)
         * @returns {Promise<Object>} 검색 결과
         */
        async searchMovies(
            query,
            page = 1,
            language = 'ko-KR',
            region = null,
            year = null,
            primaryReleaseYear = null,
            includeAdult = false
        ) {
            const params = {
                query: query,
                page: page,
                language: language,
                include_adult: includeAdult,
            };
            // 선택적 매개변수들 추가
            if (region) params.region = region;
            if (year) params.year = year;
            if (primaryReleaseYear) params.primary_release_year = primaryReleaseYear;

            return await apiBase.makeRequest('/search/movie', params);
        },

        /**
         * 특정 영화의 상세 정보 조회
         * @param {number} movieId - 영화 ID
         * @param {string} language - 언어 코드 (기본값: 'ko-KR')
         * @param {string|null} appendToResponse - 추가로 가져올 데이터 (예: 'credits,videos')
         * @returns {Promise<Object>} 영화 상세 정보
         */
        async getMovieDetails(movieId, language = 'ko-KR', appendToResponse = null) {
            const params = { language };
            if (appendToResponse) params.append_to_response = appendToResponse;
            return await apiBase.makeRequest(`/movie/${movieId}`, params);
        },

        /**
         * 인기 영화 목록 조회
         * @param {number} page - 페이지 번호 (기본값: 1)
         * @param {string} language - 언어 코드 (기본값: 'ko-KR')
         * @param {string|null} region - 지역 코드
         * @returns {Promise<Object>} 인기 영화 목록
         */
        async getPopularMovies(page = 1, language = 'ko-KR', region = null) {
            const params = { page, language };
            if (region) params.region = region;
            return await apiBase.makeRequest('/movie/popular', params);
        },

        /**
         * 최고 평점 영화 목록 조회
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드
         * @param {string|null} region - 지역 코드
         * @returns {Promise<Object>} 최고 평점 영화 목록
         */
        async getTopRatedMovies(page = 1, language = 'ko-KR', region = null) {
            const params = { page, language };
            if (region) params.region = region;
            return await apiBase.makeRequest('/movie/top_rated', params);
        },

        /**
         * 현재 상영중인 영화 목록 조회
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드
         * @param {string|null} region - 지역 코드
         * @returns {Promise<Object>} 현재 상영중인 영화 목록
         */
        async getNowPlayingMovies(page = 1, language = 'ko-KR', region = null) {
            const params = { page, language };
            if (region) params.region = region;
            return await apiBase.makeRequest('/movie/now_playing', params);
        },

        /**
         * 개봉 예정 영화 목록 조회
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드
         * @param {string|null} region - 지역 코드
         * @returns {Promise<Object>} 개봉 예정 영화 목록
         */
        async getUpcomingMovies(page = 1, language = 'ko-KR', region = null) {
            const params = { page, language };
            if (region) params.region = region;
            return await apiBase.makeRequest('/movie/upcoming', params);
        },

        /**
         * 영화의 출연진 및 제작진 정보 조회
         * @param {number} movieId - 영화 ID
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 크레딧 정보 (출연진, 제작진)
         */
        async getMovieCredits(movieId, language = 'ko-KR') {
            return await apiBase.makeRequest(`/movie/${movieId}/credits`, { language });
        },

        /**
         * 영화의 이미지 조회 (포스터, 배경 이미지 등)
         * @param {number} movieId - 영화 ID
         * @param {string} language - 언어 코드
         * @param {string|null} includeImageLanguage - 포함할 이미지 언어
         * @returns {Promise<Object>} 영화 이미지 목록
         */
        async getMovieImages(movieId, language = 'ko-KR', includeImageLanguage = null) {
            const params = { language };
            if (includeImageLanguage) params.include_image_language = includeImageLanguage;
            return await apiBase.makeRequest(`/movie/${movieId}/images`, params);
        },

        /**
         * 영화의 동영상 조회 (예고편, 티저 등)
         * @param {number} movieId - 영화 ID
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 영화 동영상 목록
         */
        async getMovieVideos(movieId, language = 'ko-KR') {
            return await apiBase.makeRequest(`/movie/${movieId}/videos`, { language });
        },

        /**
         * 영화 리뷰 조회
         * @param {number} movieId - 영화 ID
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드 (리뷰는 주로 영어)
         * @returns {Promise<Object>} 영화 리뷰 목록
         */
        async getMovieReviews(movieId, page = 1, language = 'en-US') {
            return await apiBase.makeRequest(`/movie/${movieId}/reviews`, {
                page: page,
                language: language,
            });
        },

        /**
         * 유사한 영화 목록 조회
         * @param {number} movieId - 영화 ID
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 유사한 영화 목록
         */
        async getSimilarMovies(movieId, page = 1, language = 'ko-KR') {
            return await apiBase.makeRequest(`/movie/${movieId}/similar`, {
                page: page,
                language: language,
            });
        },

        /**
         * 추천 영화 목록 조회
         * @param {number} movieId - 영화 ID
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 추천 영화 목록
         */
        async getMovieRecommendations(movieId, page = 1, language = 'ko-KR') {
            return await apiBase.makeRequest(`/movie/${movieId}/recommendations`, {
                page: page,
                language: language,
            });
        },

        /**
         * 영화 평점 매기기 (로그인 필요)
         * @param {number} movieId - 영화 ID
         * @param {number} rating - 평점 (0.5 ~ 10.0)
         * @param {string|null} sessionId - 세션 ID
         * @param {string|null} guestSessionId - 게스트 세션 ID
         * @returns {Promise<Object>} 평점 등록 결과
         */
        async rateMovie(movieId, rating, sessionId = null, guestSessionId = null) {
            const params = {};
            if (sessionId) params.session_id = sessionId;
            if (guestSessionId) params.guest_session_id = guestSessionId;

            return await apiBase.makeRequest(`/movie/${movieId}/rating`, params, 'POST', {
                value: rating,
            });
        },
    };
};

// ==================== TV SHOWS MODULE ====================
/**
 * TV 프로그램 관련 API 기능을 제공하는 모듈
 * @param {string} apiKey - TMDB API 키
 * @returns {Object} TV 프로그램 관련 메서드들을 포함한 객체
 */
export const createTV = (apiKey) => {
    const apiBase = new TMDBApiBase(apiKey);

    return {
        /**
         * TV 프로그램 검색
         * @param {string} query - 검색할 TV 프로그램 제목
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드
         * @param {number|null} firstAirDateYear - 첫 방영 연도
         * @param {boolean} includeAdult - 성인 콘텐츠 포함 여부
         * @returns {Promise<Object>} TV 프로그램 검색 결과
         */
        async searchTVShows(query, page = 1, language = 'ko-KR', firstAirDateYear = null, includeAdult = false) {
            const params = {
                query: query,
                page: page,
                language: language,
                include_adult: includeAdult,
            };
            if (firstAirDateYear) params.first_air_date_year = firstAirDateYear;

            return await apiBase.makeRequest('/search/tv', params);
        },

        /**
         * TV 프로그램 상세 정보 조회
         * @param {number} tvId - TV 프로그램 ID
         * @param {string} language - 언어 코드
         * @param {string|null} appendToResponse - 추가 데이터
         * @returns {Promise<Object>} TV 프로그램 상세 정보
         */
        async getTVShowDetails(tvId, language = 'ko-KR', appendToResponse = null) {
            const params = { language };
            if (appendToResponse) params.append_to_response = appendToResponse;
            return await apiBase.makeRequest(`/tv/${tvId}`, params);
        },

        /**
         * 인기 TV 프로그램 목록 조회
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 인기 TV 프로그램 목록
         */
        async getPopularTVShows(page = 1, language = 'ko-KR') {
            return await apiBase.makeRequest('/tv/popular', {
                page: page,
                language: language,
            });
        },

        /**
         * 최고 평점 TV 프로그램 목록 조회
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 최고 평점 TV 프로그램 목록
         */
        async getTopRatedTVShows(page = 1, language = 'ko-KR') {
            return await apiBase.makeRequest('/tv/top_rated', {
                page: page,
                language: language,
            });
        },

        /**
         * 현재 방영중인 TV 프로그램 목록 조회
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 현재 방영중인 TV 프로그램 목록
         */
        async getOnTheAirTVShows(page = 1, language = 'ko-KR') {
            return await apiBase.makeRequest('/tv/on_the_air', {
                page: page,
                language: language,
            });
        },

        /**
         * 오늘 방영되는 TV 프로그램 목록 조회
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 오늘 방영되는 TV 프로그램 목록
         */
        async getAiringTodayTVShows(page = 1, language = 'ko-KR') {
            return await apiBase.makeRequest('/tv/airing_today', {
                page: page,
                language: language,
            });
        },

        /**
         * TV 프로그램의 출연진 및 제작진 정보 조회
         * @param {number} tvId - TV 프로그램 ID
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 크레딧 정보
         */
        async getTVShowCredits(tvId, language = 'ko-KR') {
            return await apiBase.makeRequest(`/tv/${tvId}/credits`, { language });
        },

        /**
         * TV 프로그램의 동영상 조회
         * @param {number} tvId - TV 프로그램 ID
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} TV 프로그램 동영상 목록
         */
        async getTVShowVideos(tvId, language = 'ko-KR') {
            return await apiBase.makeRequest(`/tv/${tvId}/videos`, { language });
        },

        /**
         * TV 프로그램의 특정 시즌 상세 정보 조회
         * @param {number} tvId - TV 프로그램 ID
         * @param {number} seasonNumber - 시즌 번호
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 시즌 상세 정보
         */
        async getTVSeasonDetails(tvId, seasonNumber, language = 'ko-KR') {
            return await apiBase.makeRequest(`/tv/${tvId}/season/${seasonNumber}`, { language });
        },

        /**
         * TV 프로그램의 특정 에피소드 상세 정보 조회
         * @param {number} tvId - TV 프로그램 ID
         * @param {number} seasonNumber - 시즌 번호
         * @param {number} episodeNumber - 에피소드 번호
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 에피소드 상세 정보
         */
        async getTVEpisodeDetails(tvId, seasonNumber, episodeNumber, language = 'ko-KR') {
            return await apiBase.makeRequest(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`, {
                language,
            });
        },
    };
};

// ==================== PEOPLE MODULE ====================
/**
 * 인물(배우, 감독 등) 관련 API 기능을 제공하는 모듈
 * @param {string} apiKey - TMDB API 키
 * @returns {Object} 인물 관련 메서드들을 포함한 객체
 */
export const createPeople = (apiKey) => {
    const apiBase = new TMDBApiBase(apiKey);

    return {
        /**
         * 인물 검색
         * @param {string} query - 검색할 인물 이름
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드
         * @param {string|null} region - 지역 코드
         * @param {boolean} includeAdult - 성인 콘텐츠 포함 여부
         * @returns {Promise<Object>} 인물 검색 결과
         */
        async searchPeople(query, page = 1, language = 'ko-KR', region = null, includeAdult = false) {
            const params = {
                query: query,
                page: page,
                language: language,
                include_adult: includeAdult,
            };
            if (region) params.region = region;

            return await apiBase.makeRequest('/search/person', params);
        },

        /**
         * 특정 인물의 상세 정보 조회
         * @param {number} personId - 인물 ID
         * @param {string} language - 언어 코드
         * @param {string|null} appendToResponse - 추가 데이터
         * @returns {Promise<Object>} 인물 상세 정보
         */
        async getPersonDetails(personId, language = 'ko-KR', appendToResponse = null) {
            const params = { language };
            if (appendToResponse) params.append_to_response = appendToResponse;
            return await apiBase.makeRequest(`/person/${personId}`, params);
        },

        /**
         * 인기 인물 목록 조회
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 인기 인물 목록
         */
        async getPopularPeople(page = 1, language = 'ko-KR') {
            return await apiBase.makeRequest('/person/popular', {
                page: page,
                language: language,
            });
        },

        /**
         * 특정 인물의 영화 출연 이력 조회
         * @param {number} personId - 인물 ID
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 영화 출연 이력
         */
        async getPersonMovieCredits(personId, language = 'ko-KR') {
            return await apiBase.makeRequest(`/person/${personId}/movie_credits`, { language });
        },

        /**
         * 특정 인물의 TV 프로그램 출연 이력 조회
         * @param {number} personId - 인물 ID
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} TV 프로그램 출연 이력
         */
        async getPersonTVCredits(personId, language = 'ko-KR') {
            return await apiBase.makeRequest(`/person/${personId}/tv_credits`, { language });
        },

        /**
         * 특정 인물의 전체 출연 이력 조회 (영화 + TV)
         * @param {number} personId - 인물 ID
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 전체 출연 이력
         */
        async getPersonCombinedCredits(personId, language = 'ko-KR') {
            return await apiBase.makeRequest(`/person/${personId}/combined_credits`, { language });
        },

        /**
         * 특정 인물의 이미지 조회
         * @param {number} personId - 인물 ID
         * @returns {Promise<Object>} 인물 이미지 목록
         */
        async getPersonImages(personId) {
            return await apiBase.makeRequest(`/person/${personId}/images`);
        },
    };
};

// ==================== DISCOVER MODULE ====================
/**
 * 발견/탐색 기능을 제공하는 모듈 (필터링된 검색)
 * @param {string} apiKey - TMDB API 키
 * @returns {Object} 발견 관련 메서드들을 포함한 객체
 */
export const createDiscover = (apiKey) => {
    const apiBase = new TMDBApiBase(apiKey);

    return {
        /**
         * 조건에 맞는 영화 발견
         * @param {Object} params - 필터 조건들
         * @param {string} params.with_genres - 장르 ID (예: '28,12' - 액션, 모험)
         * @param {number} params.primary_release_year - 개봉 연도
         * @param {string} params.sort_by - 정렬 기준 (예: 'popularity.desc')
         * @returns {Promise<Object>} 조건에 맞는 영화 목록
         */
        async discoverMovies(params = {}) {
            const defaultParams = {
                language: 'ko-KR',
                sort_by: 'popularity.desc', // 인기순 내림차순
                page: 1,
            };
            return await apiBase.makeRequest('/discover/movie', { ...defaultParams, ...params });
        },

        /**
         * 조건에 맞는 TV 프로그램 발견
         * @param {Object} params - 필터 조건들
         * @returns {Promise<Object>} 조건에 맞는 TV 프로그램 목록
         */
        async discoverTVShows(params = {}) {
            const defaultParams = {
                language: 'ko-KR',
                sort_by: 'popularity.desc',
                page: 1,
            };
            return await apiBase.makeRequest('/discover/tv', { ...defaultParams, ...params });
        },
    };
};

// ==================== TRENDING MODULE ====================
/**
 * 트렌딩 콘텐츠 조회 모듈
 * @param {string} apiKey - TMDB API 키
 * @returns {Object} 트렌딩 관련 메서드들을 포함한 객체
 */
export const createTrending = (apiKey) => {
    const apiBase = new TMDBApiBase(apiKey);

    return {
        /**
         * 전체 트렌딩 콘텐츠 조회 (영화 + TV + 인물)
         * @param {string} timeWindow - 시간 범위 ('day' 또는 'week')
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 트렌딩 콘텐츠 목록
         */
        async getTrendingAll(timeWindow = 'day', language = 'ko-KR') {
            return await apiBase.makeRequest(`/trending/all/${timeWindow}`, { language });
        },

        /**
         * 트렌딩 영화 목록 조회
         * @param {string} timeWindow - 시간 범위 ('day' 또는 'week')
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 트렌딩 영화 목록
         */
        async getTrendingMovies(timeWindow = 'day', language = 'ko-KR') {
            return await apiBase.makeRequest(`/trending/movie/${timeWindow}`, { language });
        },

        /**
         * 트렌딩 인물 목록 조회
         * @param {string} timeWindow - 시간 범위 ('day' 또는 'week')
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 트렌딩 인물 목록
         */
        async getTrendingPeople(timeWindow = 'day', language = 'ko-KR') {
            return await apiBase.makeRequest(`/trending/person/${timeWindow}`, { language });
        },

        /**
         * 트렌딩 TV 프로그램 목록 조회
         * @param {string} timeWindow - 시간 범위 ('day' 또는 'week')
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 트렌딩 TV 프로그램 목록
         */
        async getTrendingTVShows(timeWindow = 'day', language = 'ko-KR') {
            return await apiBase.makeRequest(`/trending/tv/${timeWindow}`, { language });
        },
    };
};

// ==================== GENRES MODULE ====================
/**
 * 장르 정보 조회 모듈
 * @param {string} apiKey - TMDB API 키
 * @returns {Object} 장르 관련 메서드들을 포함한 객체
 */
export const createGenres = (apiKey) => {
    const apiBase = new TMDBApiBase(apiKey);

    return {
        /**
         * 영화 장르 목록 조회
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 영화 장르 목록 (ID와 이름)
         */
        async getMovieGenres(language = 'ko-KR') {
            return await apiBase.makeRequest('/genre/movie/list', { language });
        },

        /**
         * TV 프로그램 장르 목록 조회
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} TV 프로그램 장르 목록 (ID와 이름)
         */
        async getTVGenres(language = 'ko-KR') {
            return await apiBase.makeRequest('/genre/tv/list', { language });
        },
    };
};

// ==================== SEARCH MODULE ====================
/**
 * 통합 검색 기능을 제공하는 모듈
 * @param {string} apiKey - TMDB API 키
 * @returns {Object} 검색 관련 메서드들을 포함한 객체
 */
export const createSearch = (apiKey) => {
    const apiBase = new TMDBApiBase(apiKey);

    return {
        /**
         * 다중 검색 (영화, TV, 인물 통합 검색)
         * @param {string} query - 검색어
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드
         * @param {string|null} region - 지역 코드
         * @param {boolean} includeAdult - 성인 콘텐츠 포함 여부
         * @returns {Promise<Object>} 통합 검색 결과
         */
        async searchMulti(query, page = 1, language = 'ko-KR', region = null, includeAdult = false) {
            const params = {
                query: query,
                page: page,
                language: language,
                include_adult: includeAdult,
            };
            if (region) params.region = region;

            return await apiBase.makeRequest('/search/multi', params);
        },

        /**
         * 제작사 검색
         * @param {string} query - 검색할 제작사 이름
         * @param {number} page - 페이지 번호
         * @returns {Promise<Object>} 제작사 검색 결과
         */
        async searchCompanies(query, page = 1) {
            return await apiBase.makeRequest('/search/company', {
                query: query,
                page: page,
            });
        },

        /**
         * 컬렉션 검색 (영화 시리즈)
         * @param {string} query - 검색할 컬렉션 이름
         * @param {number} page - 페이지 번호
         * @param {string} language - 언어 코드
         * @returns {Promise<Object>} 컬렉션 검색 결과
         */
        async searchCollections(query, page = 1, language = 'ko-KR') {
            return await apiBase.makeRequest('/search/collection', {
                query: query,
                page: page,
                language: language,
            });
        },

        /**
         * 키워드 검색
         * @param {string} query - 검색할 키워드
         * @param {number} page - 페이지 번호
         * @returns {Promise<Object>} 키워드 검색 결과
         */
        async searchKeywords(query, page = 1) {
            return await apiBase.makeRequest('/search/keyword', {
                query: query,
                page: page,
            });
        },
    };
};

// ==================== UTILS MODULE ====================
/**
 * 유틸리티 기능을 제공하는 모듈 (이미지 URL 생성, 날짜 포맷 등)
 * @param {string} apiKey - TMDB API 키
 * @returns {Object} 유틸리티 메서드들을 포함한 객체
 */
export const createUtils = (apiKey) => {
    const apiBase = new TMDBApiBase(apiKey);

    return {
        /**
         * 이미지 URL 생성 (기본 함수)
         * @param {string} path - 이미지 경로 (API에서 받은 path)
         * @param {string} size - 이미지 크기 (예: 'w500', 'original')
         * @returns {string|null} 완전한 이미지 URL 또는 null
         */
        getImageUrl(path, size = 'w500') {
            if (!path) return null;
            return `${apiBase.imageBaseUrl}/${size}${path}`;
        },

        /**
         * 배경 이미지 URL 생성
         * @param {string} path - 배경 이미지 경로
         * @param {string} size - 이미지 크기 (기본값: 'w1280')
         * @returns {string|null} 배경 이미지 URL
         */
        getBackdropUrl(path, size = 'w1280') {
            return this.getImageUrl(path, size);
        },

        /**
         * 포스터 이미지 URL 생성
         * @param {string} path - 포스터 이미지 경로
         * @param {string} size - 이미지 크기 (기본값: 'w500')
         * @returns {string|null} 포스터 이미지 URL
         */
        getPosterUrl(path, size = 'w500') {
            return this.getImageUrl(path, size);
        },

        /**
         * 프로필 이미지 URL 생성 (인물 사진)
         * @param {string} path - 프로필 이미지 경로
         * @param {string} size - 이미지 크기 (기본값: 'w185')
         * @returns {string|null} 프로필 이미지 URL
         */
        getProfileUrl(path, size = 'w185') {
            return this.getImageUrl(path, size);
        },

        /**
         * 로고 이미지 URL 생성
         * @param {string} path - 로고 이미지 경로
         * @param {string} size - 이미지 크기 (기본값: 'w185')
         * @returns {string|null} 로고 이미지 URL
         */
        getLogoUrl(path, size = 'w185') {
            return this.getImageUrl(path, size);
        },

        /**
         * 스틸 이미지 URL 생성 (장면 사진)
         * @param {string} path - 스틸 이미지 경로
         * @param {string} size - 이미지 크기 (기본값: 'w300')
         * @returns {string|null} 스틸 이미지 URL
         */
        getStillUrl(path, size = 'w300') {
            return this.getImageUrl(path, size);
        },

        /**
         * 날짜 포맷팅 (YYYY-MM-DD 형식으로 변환)
         * @param {Date|string} date - 포맷할 날짜
         * @returns {string} 포맷된 날짜 문자열
         */
        formatDate(date) {
            if (date instanceof Date) {
                return date.toISOString().split('T')[0];
            }
            return date;
        },

        /**
         * 사용 가능한 이미지 크기 목록 반환
         * @returns {Object} 각 이미지 타입별 사용 가능한 크기 목록
         */
        getImageSizes() {
            return {
                backdrop_sizes: ['w300', 'w780', 'w1280', 'original'],
                logo_sizes: ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
                poster_sizes: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
                profile_sizes: ['w45', 'w185', 'h632', 'original'],
                still_sizes: ['w92', 'w185', 'w300', 'original'],
            };
        },
    };
};

// ==================== COMPLETE API CLASS ====================
/**
 * 모든 TMDB API 기능을 통합한 완전한 클래스
 *
 * 사용 예시:
 * ```javascript
 * const tmdb = new TMDBApi(import.meta.env.VITE_TMDB_API_KEY);
 *
 * // 인기 영화 조회
 * const popularMovies = await tmdb.getPopularMovies();
 *
 * // 영화 검색
 * const searchResults = await tmdb.searchMovies('어벤져스');
 *
 * // 이미지 URL 생성
 * const posterUrl = tmdb.getPosterUrl('/poster_path.jpg');
 * ```
 */
export class TMDBApi extends TMDBApiBase {
    /**
     * TMDBApi 생성자
     * @param {string} apiKey - TMDB API 키 또는 Bearer 토큰
     */
    constructor(apiKey) {
        super(apiKey);

        // 모든 모듈을 인스턴스에 추가하여 하나의 객체로 통합
        const modules = [
            createMovies(apiKey), // 영화 관련 메서드들
            createTV(apiKey), // TV 프로그램 관련 메서드들
            createPeople(apiKey), // 인물 관련 메서드들
            createDiscover(apiKey), // 발견/탐색 관련 메서드들
            createTrending(apiKey), // 트렌딩 관련 메서드들
            createGenres(apiKey), // 장르 관련 메서드들
            createSearch(apiKey), // 검색 관련 메서드들
            createUtils(apiKey), // 유틸리티 메서드들
        ];

        // 모든 모듈의 메서드들을 현재 인스턴스에 병합
        modules.forEach((module) => {
            Object.assign(this, module);
        });
    }
}

/**
 * 기본 내보내기 - TMDBApi 클래스
 *
 * 전체 기능을 사용하려면 이 클래스를 사용하세요:
 * import TMDBApi from './movieService.js';
 *
 * 특정 모듈만 사용하려면 개별 함수를 사용하세요:
 * import { createMovies, createUtils } from './movieService.js';
 */
export default TMDBApi;

/**
 * 사용 예시:
 *
 * // 1. 전체 API 사용
 * import TMDBApi from './movieService.js';
 * const tmdb = new TMDBApi(process.env.TMDB_API_KEY);
 * const movies = await tmdb.getPopularMovies();
 *
 * // 2. 특정 모듈만 사용
 * import { createMovies, createUtils } from './movieService.js';
 * const moviesApi = createMovies(process.env.TMDB_API_KEY);
 * const utilsApi = createUtils(process.env.TMDB_API_KEY);
 *
 * // 3. 이미지 URL 생성
 * const utils = createUtils();
 * const imageUrl = utils.getPosterUrl('/path/to/poster.jpg', 'w500');
 *
 * // 4. 조건부 영화 검색
 * const discover = createDiscover(apiKey);
 * const actionMovies = await discover.discoverMovies({
 *     with_genres: '28', // 액션 장르
 *     primary_release_year: 2023,
 *     sort_by: 'vote_average.desc'
 * });
 */
