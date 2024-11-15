'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDoc() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch('/api/doc')
      .then(response => response.json())
      .then(data => setSpec(data));
  }, []);

  if (!spec) {
    return <div>Loading...</div>;
  }

  return <SwaggerUI spec={spec} />;
}