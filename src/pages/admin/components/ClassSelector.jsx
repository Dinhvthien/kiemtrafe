const ClassSelector = ({ classes, selectedClassId, setSelectedClassId }) => {
    return (
        <div>
            <label className="block text-sm font-medium">Select Class</label>
            <select
                className="mt-1 block w-full border rounded p-2"
                value={selectedClassId || ''}
                onChange={(e) => setSelectedClassId(e.target.value ? parseInt(e.target.value) : null)}
            >
                <option value="">All Classes</option>
                {classes.map(cls => (
                    <option key={cls.classId} value={cls.classId}>{cls.className}</option>
                ))}
            </select>
        </div>
    );
};

export default ClassSelector;