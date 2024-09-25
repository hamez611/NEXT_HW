/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/, // .svg 파일에 대해 설정 추가
            use: ['@svgr/webpack'], // SVGR을 사용하도록 설정
        });

        return config; // 수정된 설정을 반환
    },
};

export default nextConfig;
