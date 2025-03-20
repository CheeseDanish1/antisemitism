import moment from 'moment';

export function exportToCSV(data, filename) {
    if (!data || !data.length) {
        return;
    }

    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${moment().format('YYYY-MM-DD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function convertToCSV(data) {
    const headers = ['ID', 'Name', 'High School', 'Email', 'Graduation Year', 'Reason', 'Signed At'];
    const rows = data.map(item => [
        item.id,
        escapeCsvValue(item.signer_name),
        escapeCsvValue(item.high_school_name),
        escapeCsvValue(item.email || ''),
        item.graduation_year,
        escapeCsvValue(item.reason || ''),
        item.signed_at
    ]);

    return [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
}

function escapeCsvValue(value) {
    if (value === null || value === undefined) return '';
    // Escape quotes and wrap in quotes if contains comma, quote or newline
    value = String(value).replace(/"/g, '""');
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = `"${value}"`;
    }
    return value;
}