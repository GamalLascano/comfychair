export class ProjectUtils {
    static getWordCount(text: string): number {
        return text.split(" ").length;
    }
}