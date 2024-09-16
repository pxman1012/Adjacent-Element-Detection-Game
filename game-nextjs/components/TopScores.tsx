import { useEffect, useState } from 'react';

interface Score {
    name: string;
    size: number;
    clicks: number;
}

interface TopScoresProps {
    size: number;
    reload: boolean;
}

const TopScores: React.FC<TopScoresProps> = ({ size, reload }) => {
    const [scores, setScores] = useState<Score[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-top-scores`);
                const data = await response.json();
                setScores(data[size] || []);
            } catch (error) {
                console.error('Error fetching top scores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
    }, [size, reload]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Top Scores for Size {size}</h2>
            <ul>
                {scores.length > 0 ? (
                    scores.map((score, index) => (
                        <li key={index} className="mb-2">
                            <span>{index + 1}. {score.name} - {score.clicks} clicks</span>
                        </li>
                    ))
                ) : (
                    <p>No scores available</p>
                )}
            </ul>
        </div>
    );
};

export default TopScores;
