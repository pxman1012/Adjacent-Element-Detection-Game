'use client'

import { useState, useEffect, useRef } from 'react';
import GameBoard from '../components/GameBoard';
import TopScores from '@/components/TopScores';

export default function Home() {
    const [size, setSize] = useState<number>(5); // Kích thước mặc định 5x5
    const [board, setBoard] = useState<number[][]>([]);
    const [clickCount, setClickCount] = useState<number>(0);
    const [reload, setReload] = useState<boolean>(false)
    // const remainingCells = useRef<number>(0); // Dùng useRef để lưu số lượng phần tử ban đầu
    const [remainingCells, setRemainingCells] = useState<number>(size * size); // Thêm biến lưu số lượng phần tử ban đầu


    useEffect(() => {
        generateBoard(size);
    }, [size]);

    useEffect(() => {
        // Kiểm tra nếu tất cả các ô đều đã bị xóa
        if (remainingCells === 0) {
            // if (remainingCells.current === 0) {

            // generateBoard(size)
            setRemainingCells(-1)
        }
        if (remainingCells === -1) {
            const name = prompt('You win! Enter your name to save your score:');
            if (name) saveScore(name);
            // setRemainingCells()
            setRemainingCells(-2); 
            setReload(!reload)
        }
    }, [remainingCells])

    const generateBoard = (size: number) => {
        const newBoard = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => Math.floor(Math.random() * size) + 1)
        );
        setBoard(newBoard);
        setClickCount(0); // Reset số lần click
        // remainingCells.current = size * size; // Đặt lại số lượng ô ban đầu
        setRemainingCells(size * size); // Đặt lại số lượng ô ban đầu
    };

    const handleClickCell = (row: number, col: number) => {
        const clickedValue = board[row][col];
        if (clickedValue == 0) return
        const newBoard = [...board];
        const cellsToClear = [[row, col]]; // đẩy ô vừa click vào hàng đợi
        let clearedCells = 0; // Biến lưu số lượng ô bị xóa trong mỗi lần click

        while (cellsToClear.length > 0) {
            const [r, c] = cellsToClear.pop()!; // lấy từng ô trong hàng đợi ra để duyệt các vị trí liền kề quanh ô đó
            if (newBoard[r][c] === clickedValue) {
                newBoard[r][c] = 0; // Xóa ô này
                clearedCells += 1; // Tăng số lượng ô bị xóa

                // Kiểm tra các ô liền kề nếu giống thì đẩy vào hàng đợi để duyệt tiếp
                if (r > 0 && newBoard[r - 1][c] === clickedValue) cellsToClear.push([r - 1, c]);
                if (r < size - 1 && newBoard[r + 1][c] === clickedValue) cellsToClear.push([r + 1, c]);
                if (c > 0 && newBoard[r][c - 1] === clickedValue) cellsToClear.push([r, c - 1]);
                if (c < size - 1 && newBoard[r][c + 1] === clickedValue) cellsToClear.push([r, c + 1]);
            }
        }

        setBoard(newBoard);
        setClickCount(clickCount + 1);
        // remainingCells.current -= clearedCells; // Cập nhật số lượng ô còn lại
        setRemainingCells(remainingCells - clearedCells); // Cập nhật số lượng ô còn lại

    };

    const saveScore = async (name: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/save-score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, size, clicks: clickCount }),
        });
        if (response.ok) {
            alert('Score saved successfully!');
        }
    };

    return (
        <div className="p-8 w-fit m-auto">
            <h1 className="text-2xl font-bold mb-4">Game Board {size}x{size}</h1>
            <div className='flex gap-2'>
                <input
                    type="number"
                    min="2"
                    max="10"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="border p-2 mb-4"
                />
                <button
                    onClick={() => generateBoard(size)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
                >
                    New Game
                </button>
            </div>
            <p className="mt-4">Số lần click: {clickCount}</p>
            {/* <p className="mt-4">Số lần xóa: {remainingCells}</p> */}
            <div className='flex flex-wrap gap-4'>
                <GameBoard size={size} onClickCell={handleClickCell} board={board} />
                <TopScores size={size} reload={reload}/>
            </div>
        </div>
    );
}
