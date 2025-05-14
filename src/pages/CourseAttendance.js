import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourseAttendance = ({ courseId, courseName, courseType, series, group, token }) => {
  const [dates, setDates]       = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError]       = useState('');

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/attendance/course/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setDates(res.data.dates);
      setStudents(res.data.students);
    })
    .catch(() => setError('Failed to load attendance'));
  }, [courseId, token]);

  const handleExport = () => {
    const suffix = courseType === "Lecture" ? series : group;
    // 1) metadata rows
    const metaRows = [
      ["Course Name", courseName],
      ["Course Type – Suffix", `${courseType} – ${suffix}`],
      []  // blank line before the table
    ];
    const header = ['Student', ...dates, 'Total Present', '% Present'];

    const rows = students.map(s => {
      const presentCount = s.attendance.filter(v => v === 'present').length;
      const pct = dates.length
        ? Math.round(100 * presentCount / dates.length) + '%'
        : '0%';

      return [
        s.full_name,
        ...s.attendance.map(v => v === 'present' ? '✓' : '-'),
        presentCount,
        pct
      ];
    });

    // 4) assemble all rows
    const allRows = [...metaRows, header, ...rows];

    const csv = allRows
      .map(r => r.map(cell => `"${cell}"`).join(","))
      .join("\r\n");

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `course_${courseId}_attendance.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (error)       return <div className="alert alert-danger">{error}</div>;
  if (!dates.length) return <p>Loading…</p>;

  return (
    <>
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={handleExport}>
          📥 Export CSV
        </button>
      </div>

      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th>Student</th>
            {dates.map(d => <th key={d}>{d}</th>)}
            <th>Total Present</th>
            <th>% Present</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => {
            const total = s.attendance.filter(v => v === "present").length;
            const pct   = dates.length
              ? Math.round(100 * total / dates.length)
              : 0;
            return (
              <tr key={s.student_id}>
                <td>{s.full_name}</td>
                {s.attendance.map((v,i) =>
                  <td key={i} className={v==="present" ? "table-success" : "table-danger"}>
                    {v === "present" ? "✓" : "—"}
                  </td>
                )}
                <td>{total}</td>
                <td>{pct}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default CourseAttendance;
