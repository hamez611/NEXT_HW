const express = require('express'); //express 모듈을 가져옴
const cors = require('cors'); //cors(Cross-Origin Resource Sharing) 모듈을 가져옴. 다른 도메인에서 서버의 리소스에 접근할 수 있도록 하는 방법
const { Pool } = require('pg'); //pg 모듈에서 Pool 클래스를 가져옴. PostgreSQL DB를 Node.js Application과 연결해주는 라이브러리
require('dotenv').config(); //dotenv 패키지가 .env 파일에 정의된 환경 변수를 로드하도록 함.
console.log(process.env.DATABASE_URL); //환경변수값 체크

const app = express(); //express application 초기화. app 객체는 HTTP 요청 처리에 사용.
app.use(
    cors({
        origin: 'http://localhost:3000', // 프론트엔드 주소
    })
);
app.use(express.json()); //JSON형식의 요청 본문을 자동으로 파싱하여 req.body에 넣어줌.

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, //DB와 연결
    ssl: false, //ssl 사용x
});
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully');
    }
});

app.get('/ping', (req, res) => {
    res.send('Server is working!');
});

//검색
app.get('/api/guestbook/search', async (req, res) => {
    const { query } = req.query;
    const searchQuery = query ? String(query) : '';

    try {
        const sqlQuery = `
            SELECT g.id, g.name, g.message, g.created_at,
                   COALESCE(json_agg(
                     CASE WHEN c.id IS NOT NULL THEN
                       json_build_object('id', c.id, 'name', c.name, 'comment', c.comment, 'created_at', c.created_at)
                     ELSE NULL END
                   ) FILTER (WHERE c.id IS NOT NULL), '[]') AS comments
            FROM guestbook g
            LEFT JOIN comments c ON g.id = c.guestbook_id
            WHERE g.message ILIKE $1 OR c.comment ILIKE $1
            GROUP BY g.id
            ORDER BY g.created_at DESC;
        `;

        console.log('Executing SQL query:', sqlQuery);
        console.log('Search query:', searchQuery);

        const result = await pool.query(sqlQuery, [`%${searchQuery}%`]);

        console.log('Query result:', result.rows);

        res.json(result.rows);
    } catch (err) {
        console.error('Search error:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});
//작성자 검색 기능

app.get('/api/guestbook/searchByAuthor', async (req, res) => {
    const { author } = req.query;

    // `author`가 문자열인지 확인하고, 아니면 빈 문자열로 처리
    const searchAuthor = typeof author === 'string' ? author : '';

    try {
        const result = await pool.query(
            `
            SELECT g.id, g.name, g.message, g.created_at,
                   json_agg(json_build_object('id', c.id, 'name', c.name, 'comment', c.comment, 'created_at', c.created_at)) AS comments
            FROM guestbook g
            LEFT JOIN comments c ON g.id = c.guestbook_id
            WHERE g.name ILIKE $1 OR c.name ILIKE $1
            GROUP BY g.id
            ORDER BY g.created_at DESC;
        `,
            [`%${searchAuthor}%`]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Error searching entries by author:', err);
        res.status(500).json({ error: err.message });
    }
});

//방명록 항목 추가
app.post('/api/guestbook', async (req, res) => {
    const { name, message, password } = req.body;
    try {
        //Q. guestbook 이라는 테이블에 name, message, password 컬럼에 값을 추가하세요. 값을 추가하고, 바로 반환해서 확인하세요.
        const result = await pool.query(
            'INSERT INTO guestbook (name, message, password) VALUES ($1, $2, $3) RETURNING *',
            [name, message, password]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 방명록 항목 가져오기
app.get('/api/guestbook', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT g.id, g.name, g.message, g.created_at,
                   COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name, 'comment', c.comment, 'created_at', c.created_at))
                    FILTER (WHERE c.id IS NOT NULL), '[]') AS comments
            FROM guestbook g
            LEFT JOIN comments c ON g.id = c.guestbook_id
            GROUP BY g.id
            ORDER BY g.created_at DESC;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//방명록 항목 수정
app.put('/api/guestbook/:id', async (req, res) => {
    const { id } = req.params;
    const { message, password } = req.body;
    try {
        //Q. guestbook 테이블에서 id로 특정 항목의 비밀번호를 가져오세요.
        const result = await pool.query('SELECT password FROM guestbook WHERE id = $1', [id]);
        if (result.rows.length > 0 && result.rows[0].password === password) {
            //Q. guestbook 테이블에서 id로 특정 항목의 message를 업데이트하세요.
            const updateResult = await pool.query(
                'UPDATE guestbook SET message = $1 WHERE id = $2 RETURNING id, name, message, created_at',
                [message, id]
            );
            res.json(updateResult.rows[0]);
        } else {
            res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//방명록 항목 삭제
app.delete('/api/guestbook/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    console.log('Attempting to delete entry with id:', id); // 로그 추가
    console.log('Provided password:', password); // 로그 추가
    try {
        //Q. guestbook 테이블에서 id로 특정 항목의 비밀번호를 가져오세요.
        const result = await pool.query('SELECT password FROM guestbook WHERE id = $1', [id]);
        if (result.rows.length > 0 && result.rows[0].password === password) {
            console.log('Password matches, deleting entry.');
            await pool.query('DELETE FROM comments WHERE guestbook_id = $1', [id]);
            await pool.query('DELETE FROM guestbook WHERE id = $1', [id]);
            res.json({ message: '삭제되었습니다.' });
        } else {
            console.log('Password mismatch or entry not found.');
            res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
        }
    } catch (err) {
        console.error('Error deleting entry:', err);
        res.status(500).json({ error: err.message });
    }
});

//댓글 작성

app.post('/api/comment/:guestbookId', async (req, res) => {
    const { guestbookId } = req.params;
    const { name, comment, password } = req.body;
    try {
        const guestbookCheck = await pool.query('SELECT id FROM guestbook WHERE id = $1', [guestbookId]);
        if (guestbookCheck.rows.length === 0) {
            return res.status(404).json({ error: '해당 방명록 항목을 찾을 수 없습니다.' });
        }

        const result = await pool.query(
            'INSERT INTO comments (guestbook_id, name, comment, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [guestbookId, name, comment, password]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 댓글 삭제
app.delete('/api/comment/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    try {
        const result = await pool.query('DELETE FROM comments WHERE id = $1 AND password = $2 RETURNING *', [
            id,
            password,
        ]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: '댓글을 찾을 수 없거나 비밀번호가 일치하지 않습니다.' });
        }
        res.json({ message: '댓글이 성공적으로 삭제되었습니다.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 방명록 항목과 관련 댓글 조회
app.get('/api/guestbook/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const guestbookEntry = await pool.query('SELECT * FROM guestbook WHERE id = $1', [id]);
        const comments = await pool.query(
            'SELECT id, name, comment, created_at FROM comments WHERE guestbook_id = $1',
            [id]
        );

        if (guestbookEntry.rows.length === 0) {
            return res.status(404).json({ error: '방명록 항목을 찾을 수 없습니다.' });
        }

        const result = {
            ...guestbookEntry.rows[0],
            comments: comments.rows,
        };

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.send('Server is working!');
});

//서버 실행
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
